from model.sql import SQL
from settings.settings_enum import SettingsEnum
from utils.prints import print_err


class SightingModel(SQL):

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
            print_err(f"Failed to initialize SightingModel: {e}")

    def refresh_table(self):
        self.file_path = self.settings.get_setting(SettingsEnum.SIGHTING_FILE_PATH.value)
        sighting_create = f"""
                    CREATE TABLE sighting  (
                       SightingId INTEGER PRIMARY KEY AUTOINCREMENT,
                       SightingEGNo INTEGER,
                       AssociationId INTEGER,
                       SightingYear INTEGER,
                       SightingMonth INTEGER,
                       SightingDay INTEGER,
                       ObserverCode TEXT,
                       SightingTime INTEGER,
                       SightingLetter TEXT,
                       FieldEGNo INTEGER
                    )"""
        self.load_table('sighting', sighting_create, self.file_path, 'SightingId')

    def get_all_sightings(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute('SELECT * FROM sighting')
            rows = cursor.fetchall()
            cursor.close()
            return [dict(row) for row in rows]
        except Exception as e:
            print_err(f"Failed to execute SQL query get_all_sightings: {e}")
        return None

    def get_sighting_by_id(self, sighting_id):
        try:
            cursor = self.conn.cursor()
            cursor.execute(f'SELECT * FROM sighting WHERE SightingId = {sighting_id}')
            row = cursor.fetchone()
            cursor.close()
            return dict(row) if row else None
        except Exception as e:
            print_err(f"Failed to execute SQL query get_sighting_by_id: {e}")
        return None

    def get_sightings_by_date(self, year, month, day, observer_code):
        try:
            cursor = self.conn.cursor()
            cursor.execute(f"SELECT * FROM sighting WHERE SightingYear = {year} AND SightingMonth = {month} AND SightingDay = {day} AND ObserverCode = '{observer_code}'")
            rows = cursor.fetchall()
            cursor.close()
            return [dict(row) for row in rows]
        except Exception as e:
            print_err(f"Failed to execute SQL query get_sightings_by_date: {e}")
        return None

