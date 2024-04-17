from enum import Enum


class SettingsEnum(Enum):
    ASSOCIATION_FILE_PATH = 'association_file_path'
    ASSOCIATION_SHEET_NAME = 'association_sheet_name'

    @classmethod
    def has_value(cls, value):
        return value in cls._value2member_map_
