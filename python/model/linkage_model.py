import json

from model.sql import SQL
from settings.settings_enum import SettingsEnum
from utils.prints import print_err


class LinkageModel(SQL):

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
            print_err(f"Failed to initialize LinkageModel: {e}")

    def refresh_table(self):
        self.file_path = self.settings.get_setting(SettingsEnum.LINKAGE_FILE_PATH.value)

        linkage_create = f"""
                    CREATE TABLE linkage  (
                       LinkageId INTEGER PRIMARY KEY AUTOINCREMENT,
                       CatalogVideoId INTEGER,
                       SightingId INTEGER,
                       StartTime TEXT,
                       EndTime TEXT,
                       Annotation JSON,
                       ThumbnailFilePath TEXT,
                       CreatedBy TEXT,
                       CreatedDate TEXT
                    )"""

        self.load_table('linkage', linkage_create, self.file_path, 'LinkageId')

    def get_linkage_by_id(self, linkage_id):
        try:
            cursor = self.conn.cursor()
            cursor.execute(f'SELECT * FROM linkage WHERE LinkageId = {linkage_id}')
            row = cursor.fetchone()
            cursor.close()
            return dict(row) if row else None
        except Exception as e:
            print_err(f"Failed to execute SQL query get_linkage_by_id: {e}")
        return None

    def create_linkage(self, payload):
        try:
            cursor = self.conn.cursor()
            payload['Annotation'] = json.dumps(payload['Annotation'])
            query = """
                INSERT INTO linkage
                (CatalogVideoId, SightingId, StartTime, EndTime, Annotation, ThumbnailFilePath, CreatedBy, CreatedDate)
                VALUES (:CatalogVideoId, :SightingId, :StartTime, :EndTime, :Annotation, :ThumbnailFilePath, '', :CreatedDate)
            """
            cursor.execute(query, payload)
            self.conn.commit()

            self.flush_to_excel('linkage', self.file_path, self.worksheet_name)

            lastrowid = cursor.lastrowid
            cursor.close()
            return lastrowid
        except Exception as e:
            print_err(f"Failed to execute SQL query create_linkage: {e}")
            raise e

    def delete_linkage_by_id(self, linkage_id):
        try:
            cursor = self.conn.cursor()
            cursor.execute(f"DELETE FROM linkage WHERE LinkageId = {linkage_id}")
            self.conn.commit()

            self.flush_to_excel('linkage', self.file_path, self.worksheet_name)
            cursor.close()
        except Exception as e:
            print_err(f"Failed to execute SQL query delete_linkage_by_id: {e}")
            raise e

    def get_linkages_by_sighting(self, year, month, day, observer_code):
        try:
            sighting_query = ""
            if month:
                sighting_query += f" AND SightingMonth = {month}"
            if day:
                sighting_query += f" AND SightingDay = {day}"
            if observer_code:
                sighting_query += f" AND ObserverCode = '{observer_code}'"

            cursor = self.conn.cursor()
            cursor.execute(f"""
                           SELECT l.*, s.SightingYear, s.SightingMonth, s.SightingDay, s.ObserverCode, s.SightingLetter, v.FrameRate
                           FROM Linkage l
                           JOIN Sighting s ON l.SightingId = s.SightingId
                           JOIN Video v ON l.CatalogVideoId = v.CatalogVideoId
                           WHERE s.SightingYear = {year}{sighting_query}
            """)
            rows = cursor.fetchall()
            cursor.close()
            return [dict(row) for row in rows]
        except Exception as e:
            print_err(f"Failed to execute SQL query get_linkages_by_sighting: {e}")
        return None
