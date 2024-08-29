from enum import Enum

class SettingsEnum(Enum):
    LINKAGE_FILE_PATH = 'linkage_file_path'
    SIGHTING_FILE_PATH = 'sighting_file_path'
    VIDEO_FILE_PATH = 'video_file_path'
    FOLDER_FILE_PATH = 'folder_file_path'
    STILL_EXPORT_FILE_PATH = 'still_export_file_path'

    THUMBNAIL_DIR_PATH = 'thumbnail_dir_path'
    STILLEXPORT_DIR_PATH = 'stillexport_dir_path'

    BASE_FOLDER_OF_VIDEOS = 'base_folder_of_videos'
    BASE_FOLDER_OF_ORIGINAL_VIDEOS = 'base_folder_of_original_videos'

    BASE_FOLDER_OF_OPTIMIZED_IMAGES = 'base_folder_of_optimized_images'
    BASE_FOLDER_OF_ORIGINAL_IMAGES = 'base_folder_of_original_images'

    @classmethod
    def has_value(cls, value):
        return value in cls._value2member_map_

    @classmethod
    def structured_folders(cls):
        return [
            cls.BASE_FOLDER_OF_VIDEOS.value,
            cls.BASE_FOLDER_OF_ORIGINAL_VIDEOS.value,
            cls.BASE_FOLDER_OF_OPTIMIZED_IMAGES.value,
            cls.BASE_FOLDER_OF_ORIGINAL_IMAGES.value,
        ]
