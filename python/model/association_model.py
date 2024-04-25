import sys
import json

from model.sql import SQL
from settings.settings_enum import SettingsEnum


class AssociationModel(SQL):

    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(SQL, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        super().__init__()

        self.file_path = None
        self.worksheet_name = None
        self.refresh_table()

    def refresh_table(self):
        self.file_path = self.settings.get_setting(SettingsEnum.ASSOCIATION_FILE_PATH.value)
        self.worksheet_name = self.settings.get_setting(SettingsEnum.ASSOCIATION_SHEET_NAME.value)

        association_create = f"""
                    CREATE TABLE association  (
                       AssociationId INTEGER PRIMARY KEY AUTOINCREMENT,
                       CatalogVideoId INTEGER,
                       SightingId INTEGER,
                       StartTime TEXT,
                       EndTime TEXT,
                       Annotation JSON,
                       ThumbnailFilePath TEXT,
                       CreatedBy TEXT,
                       CreatedDate TEXT
                    )"""

        self.load_table('association', association_create, self.file_path, self.worksheet_name, 'AssociationId')

    def get_all_associations(self):
        try:
            self.cursor.execute('SELECT * FROM association')
            rows = self.cursor.fetchall()
            return [dict(row) for row in rows]
        except Exception as e:
            sys.stderr.write(f"Failed to execute SQL query get_all_associations: {e}")
        return None

    def get_association_by_id(self, association_id):
        try:
            self.cursor.execute(f'SELECT * FROM association WHERE AssociationId = {association_id}')
            rows = self.cursor.fetchall()
            return [dict(row) for row in rows]
        except Exception as e:
            sys.stderr.write(f"Failed to execute SQL query get_association_by_id: {e}")
        return None

    def create_association(self, payload):
        try:
            payload['Annotation'] = json.dumps(payload['Annotation'])
            query = """
                INSERT INTO association
                (SightingId, StartTime, EndTime, Annotation, ThumbnailFilePath, CreatedBy, CreatedDate)
                VALUES (:SightingId, :StartTime, :EndTime, :Annotation, :ThumbnailFilePath, :CreatedBy, :CreatedDate)
            """
            self.cursor.execute(query, payload)
            self.conn.commit()

            self.flush_to_excel('association', self.file_path, self.worksheet_name)
            return self.cursor.lastrowid

        except Exception as e:
            sys.stderr.write(f"Failed to execute SQL query create_associations: {e}")
            raise

    def delete_association_by_id(self, association_id):
        try:
            self.cursor.execute(f"DELETE FROM association WHERE AssociationId = {association_id}")
            self.conn.commit()

            self.flush_to_excel('association', self.file_path, self.worksheet_name)
        except Exception as e:
            sys.stderr.write(f"Failed to execute SQL query delete_association_by_id: {e}")
            raise e
