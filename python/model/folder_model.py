import sys

from model.sql import SQL
from settings.settings_enum import SettingsEnum


class FolderModel(SQL):
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(SQL, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        try:
            super().__init__()

            self.file_path = None

            self.refresh_table()
        except Exception as e:
            (sys.stderr.write
             (f"Failed to initialize  FolderModel: {e}"))

    def refresh_table(self):
        self.file_path = self.settings.get_setting(SettingsEnum.FOLDER_FILE_PATH.value)
        folder_create = f"""
                    CREATE TABLE folder  (
                       CatalogFolderId INTEGER PRIMARY KEY AUTOINCREMENT,
                       FolderYear INTEGER,
                       FolderMonth INTEGER,
                       FolderDay INTEGER,
                       ObserverCode TEXT,
                       CreatedBy TEXT,
                       CreatedDate TEXT
                    )"""
        self.load_table('folder', folder_create, self.file_path,  'CatalogFolderId')
