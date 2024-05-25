from model.sql import SQL
from settings.settings_enum import SettingsEnum
from utils.prints import print_err


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
            (print_err
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

    def get_folder_by_id(self, folder_id):
        try:
            cursor = self.conn.cursor()
            cursor.execute(f'SELECT * FROM folder WHERE CatalogFolderId = {folder_id}')
            row = cursor.fetchone()
            cursor.close()
            return dict(row) if row else None
        except Exception as e:
            print_err(f"Failed to execute SQL query get_folder_by_id: {e}")
        return None
