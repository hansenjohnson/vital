import os
import re

from settings.settings_model import SettingsModel
from settings.settings_enum import SettingsEnum

def get_subdir_names(path):
    return [f.name for f in os.scandir(path) if f.is_dir()]

class SettingsService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SettingsService, cls).__new__(cls)
            cls._instance.model = SettingsModel()
        return cls._instance

    def get_setting(self, key):
        return self.model.get_setting(key)

    def set_setting(self, key, value):
        if SettingsEnum.has_value(key):
            self.model.set_setting(key, value)
        else:
            raise ValueError(f"Invalid setting key: {key}")

    def delete_setting(self, key):
        return self.model.delete_setting(key)

    def validate_setting(self, key, value, setting_type):
        if setting_type == 'folder' and not os.path.isdir(value):
            raise Exception(f"Folder does not exist")

        if setting_type == 'excel':
            if not value.endswith('.xlsx'):
                raise Exception(f"File is not an xlsx file")
            if not os.path.isfile(value):
                raise Exception(f"File does not exist")

        if key in SettingsEnum.structured_folders():
            subdirs_1 = get_subdir_names(value)
            has_some_decade = False
            has_some_year = False

            for fldr in subdirs_1:
                if re.match(r'^\d{4}-\d{4}$', fldr):
                    has_some_decade = True
                    subdirs_2 = get_subdir_names(os.path.join(value, fldr))
                    for fldr2 in subdirs_2:
                        if re.match(r'^\d{4}$', fldr2):
                            has_some_year = True
                            break
                if has_some_year:
                    break
            
            if not (has_some_decade and has_some_year):
                raise Exception(f"Invalid folder structure. Must contain subfolders like: {os.path.join('2020-2029', '2021')}")
