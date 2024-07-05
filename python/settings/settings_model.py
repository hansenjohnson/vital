import configparser
import os


class SettingsModel:
    def __init__(self):
        self.config = configparser.ConfigParser()
        self.file_path = os.path.join(os.getenv('APPDATA'), 'VITAL', 'settings.ini')
        os.makedirs(os.path.dirname(self.file_path), exist_ok=True)
        self.config.read(self.file_path)

    def get_setting(self, key):
        if self.config.has_section('Settings'):
            try:
                return self.config.get('Settings', key)
            except configparser.NoOptionError:
                return ''
        else:
            return ''

    def set_setting(self, key, value):
        if not self.config.has_section('Settings'):
            self.config.add_section('Settings')
        self.config.set('Settings', key, value)
        with open(self.file_path, 'w') as configfile:
            self.config.write(configfile)
