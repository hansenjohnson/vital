from model.association.sql import SQL
from settings.settings_enum import SettingsEnum

from utils.prints import print_err

class ObserverModel(SQL):

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
            print_err(f"Failed to initialize ObserverModel: {e}")

    def refresh_table(self):
        self.file_path = self.settings.get_setting(SettingsEnum.OBSERVER_FILE_PATH.value)
        observer_create = f"""
                    CREATE TABLE observer  (
                       ObserverCode TEXT
                    )"""
        self.load_table('observer', observer_create, self.file_path, 'ObserverCode')

    
    def get_all_observers(self):
        try:
            cursor = self.conn.cursor()
            cursor.execute('SELECT * FROM observer')
            rows = cursor.fetchall()
            cursor.close()
            return list(set([row[0] for row in rows]))
        except Exception as e:
            print_err(f"Failed to execute SQL query get_all_sightings: {e}")
        return None