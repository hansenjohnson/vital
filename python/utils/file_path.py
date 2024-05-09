import math
import os
from datetime import datetime

from settings.settings_service import SettingsService
from settings.settings_enum import SettingsEnum

from model.folder_model import FolderModel
from model.video_model import VideoModel

settings_service = SettingsService()
folder_model = FolderModel()
video_model = VideoModel()


def catalog_folder_path(catalog_folder_id):
    base_folder_path = settings_service.get_setting(SettingsEnum.BASE_FOLDER_OF_VIDEOS.value)
    folder_by_id = folder_model.get_folder_by_id(catalog_folder_id)
    folder_year = folder_by_id['FolderYear']

    folder_floor_10 = math.floor(folder_year / 10) * 10
    folder_year_range = (folder_floor_10, folder_floor_10 + 9)

    date = datetime.strptime(f"{folder_by_id['FolderYear']}-{folder_by_id['FolderMonth']}-{folder_by_id['FolderDay']}", "%Y-%m-%d")
    formatted_date = date.strftime("%Y-%m-%d")

    folder_catalog_name = f"{formatted_date}-{folder_by_id['ObserverCode']}"

    return os.path.join(base_folder_path, f"{folder_year_range[0]}-{folder_year_range[1]}", str(folder_year), folder_catalog_name)


def video_file_path(catalog_video_id):
    file_by_id = video_model.get_optimized_video_by_id(catalog_video_id)

    catalog_folder_id = file_by_id['CatalogFolderId']
    folder_path = catalog_folder_path(catalog_folder_id)

    return os.path.join(folder_path, file_by_id['OptimizedFileName'])
