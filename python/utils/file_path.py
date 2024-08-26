import math
import os
import re
from datetime import datetime

from settings.settings_service import SettingsService
from settings.settings_enum import SettingsEnum

from model.association.folder_model import FolderModel
from model.association.video_model import VideoModel

settings_service = SettingsService()
folder_model = FolderModel()
video_model = VideoModel()


def catalog_folder_subdir(year, month, day, observer_code):
    date = datetime.strptime(f"{year}-{month}-{day}", "%Y-%m-%d")
    formatted_date = date.strftime("%Y-%m-%d")
    return f"{formatted_date}-{observer_code.replace('/', '-')}"


def catalog_folder_path(catalog_folder_id, settings_enum):
    base_folder_path = settings_service.get_setting(settings_enum)
    folder_by_id = folder_model.get_folder_by_id(catalog_folder_id)
    return construct_catalog_folder_path(
        base_folder_path,
        folder_by_id['FolderYear'],
        folder_by_id['FolderMonth'],
        folder_by_id['FolderDay'],
        folder_by_id['ObserverCode'],
    )

"""
Note: in this function, file_type refers to the column name in the video table
"""
def video_file_path(catalog_video_id, settings_enum, file_type):
    video_by_id = video_model.get_video_by_id(catalog_video_id)

    catalog_folder_id = video_by_id['CatalogFolderId']
    folder_path = catalog_folder_path(catalog_folder_id, settings_enum)

    return os.path.join(folder_path, video_by_id[file_type])


def extract_catalog_folder_info(string):
    match = re.match(r"^(\d{4}-\d{2}-\d{2})-(.*)$", string)
    if match:
        date_str = match.group(1)
        date = datetime.strptime(date_str, "%Y-%m-%d")
        observer_code = match.group(2)
        return date.year, date.month, date.day, observer_code
    else:
        raise ValueError("Filename does not match the expected format YYYY-MM-DD-observer_code")

def construct_catalog_folder_path(base_path, year, month, day, observer_code):
    folder_floor_10 = math.floor(year / 10) * 10
    folder_year_range = f"{folder_floor_10}-{folder_floor_10 + 9}"

    catalog_folder_name = catalog_folder_subdir(year, month, day, observer_code)

    folder_path = os.path.join(base_path, folder_year_range, str(year), catalog_folder_name)
    return folder_path

def make_one_dir_ok_exists(path):
    try:
        os.mkdir(path)
    except FileExistsError:
        pass
