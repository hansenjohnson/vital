import os
from settings.settings_service import SettingsService
from settings.settings_enum import SettingsEnum

settings_service = SettingsService()

class ThumbnailService:
    def write_thumbnail(self, blob, filepath):
        thumbnail_dir_path = settings_service.get_setting(SettingsEnum.THUMBNAIL_DIR_PATH.value)
        final_file_path = os.path.join(thumbnail_dir_path, filepath)
        final_file_dir = os.path.dirname(final_file_path)

        os.makedirs(final_file_dir, exist_ok=True)

        with open(final_file_path, 'wb') as file_handle:
            file_handle.write(blob)
