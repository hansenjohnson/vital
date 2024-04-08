from sqlitedict import SqliteDict


class SettingsModel:
    def __init__(self):
        self.db = SqliteDict('./settings_controller.sqlite', autocommit=True)

    def get_setting(self, key):
        return self.db.get(key)

    def set_setting(self, key, value):
        self.db[key] = value
