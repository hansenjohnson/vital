from enum import Enum


class SettingsEnum(Enum):
    LINKAGE_FILE_PATH = 'linkage_file_path'
    SIGHTING_FILE_PATH = 'sighting_file_path'
    VIDEO_FILE_PATH = 'video_file_path'
    FOLDER_FILE_PATH = 'folder_file_path'

    THUMBNAIL_DIR_PATH = 'thumbnail_dir_path'
    STILLFRAME_DIR_NAME = 'stillframe_dir_path'

    BASE_FOLDER_OF_VIDEOS = 'base_folder_of_videos'
    FOLDER_OF_VIDEOS = 'folder_of_videos'

    @classmethod
    def has_value(cls, value):
        return value in cls._value2member_map_
