import sys

from model.sql import SQL
from settings.settings_enum import SettingsEnum
from utils.prints import print_err


class StillExportModel(SQL):

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
            print_err(f"Failed to initialize StillExportModel: {e}")

    def refresh_table(self):
        self.file_path = self.settings.get_setting(SettingsEnum.STILL_EXPORT_FILE_PATH.value)
        still_export_create = f"""
                    CREATE TABLE still_export  (
                       StillExportId INTEGER PRIMARY KEY AUTOINCREMENT,
                       CatalogVideoId INTEGER,
                       SightingId INTEGER,
                       FileName TEXT,
                       FileLocation TEXT,
                       FrameNumber INTEGER,
                       CreatedBy TEXT,
                       CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
                    )"""
        self.load_table('still_export', still_export_create, self.file_path, 'StillExportId')

    def create_still_export(self, payload):
        try:
            cursor = self.conn.cursor()
            query = """
                INSERT INTO still_export
                    (CatalogVideoId, FileName, FileLocation, FrameNumber, SightingId)
                VALUES
                    (:CatalogVideoId, :FileName, :FileLocation, :FrameNumber, :SightingId)
            """
            cursor.execute(query, payload)
            self.conn.commit()
            self.flush_to_excel()
            cursor.close()
        except PermissionError as e:
            self.refresh_table()
            raise e
        except Exception as e:
            print_err(f"Failed to execute SQL query create_still_export: {e}")
            raise e

    def flush_to_excel(self):
        return super().flush_to_excel('still_export', self.file_path, self.worksheet_name)
