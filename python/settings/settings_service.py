from settings.settings_model import SettingsModel


class SettingsService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SettingsService, cls).__new__(cls)
            cls._instance.model = SettingsModel()
        return cls._instance

    def get_association_file_path(self):
        return self.model.get_setting('association_file_path')

    def set_association_file_path(self, file_path):
        self.model.set_setting('association_file_path', file_path)

    def get_association_sheet_name(self):
        return self.model.get_setting('association_sheet_name')

    def set_association_sheet_name(self, sheet_name):
        self.model.set_setting('association_sheet_name', sheet_name)

    def clear_file_settings(self):
        self.model.set_setting('association_file_path', None)
        self.model.set_setting('association_sheet_name', None)
