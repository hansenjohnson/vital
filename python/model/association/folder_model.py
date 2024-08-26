from model.association.sql import SQL
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
                       CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
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

    def create_folder(self, year, month, day, observer_code):
        try:
            cursor_1 = self.conn.cursor()
            query_1 = f"""SELECT * FROM folder
                WHERE FolderYear = ?
                AND FolderMonth = ?
                AND FolderDay = ?
                AND ObserverCode = ?
            """
            cursor_1.execute(query_1, (year, month, day, observer_code))
            existing_row = cursor_1.fetchone()
            cursor_1.close()
            if existing_row:
                return existing_row['CatalogFolderId']

            cursor = self.conn.cursor()
            query = """
                INSERT INTO folder
                (FolderYear, FolderMonth, FolderDay, ObserverCode)
                VALUES (:FolderYear, :FolderMonth, :FolderDay, :ObserverCode)
            """
            cursor.execute(query, (year, month, day, observer_code))
            self.conn.commit()

            self.flush_to_excel()

            lastrowid = cursor.lastrowid
            cursor.close()
            return lastrowid
        except PermissionError as e:
            self.refresh_table()
            raise e
        except Exception as e:
            print_err(f"Failed to execute SQL query create_folder: {e}")
            raise e

    def flush_to_excel(self):
        return super().flush_to_excel('folder', self.file_path, self.worksheet_name)
