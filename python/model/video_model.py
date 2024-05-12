import sys

from model.sql import SQL
from settings.settings_enum import SettingsEnum


class VideoModel(SQL):
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
            (sys.stderr.write
             (f"Failed to initialize  VideoModel: {e}"))

    def refresh_table(self):
        self.file_path = self.settings.get_setting(SettingsEnum.VIDEO_FILE_PATH.value)
        video_model = f"""
                    CREATE TABLE video  (
                       CatalogVideoId INTEGER PRIMARY KEY AUTOINCREMENT,
                       CatalogFolderId INTEGER,
                       OriginalFileName TEXT,
                       OptimizedFileName TEXT,
                       CreatedBy TEXT,
                       CreatedDate TEXT
                    )"""
        self.load_table('video', video_model, self.file_path, 'CatalogVideoId')

    def get_videos_by_folder_id(self, folder_id):
        try:
            cursor = self.conn.cursor()
            cursor.execute(f'SELECT * FROM video WHERE CatalogFolderId = {folder_id}')
            rows = cursor.fetchall()
            cursor.close()
            return [dict(row) for row in rows]
        except Exception as e:
            sys.stderr.write(f"Failed to execute SQL query get_videos_by_folder_id: {e}")
        return None

    def get_video_by_id(self, video_id):
        try:
            cursor = self.conn.cursor()
            cursor.execute(f'SELECT * FROM video WHERE CatalogVideoId = {video_id}')
            row = cursor.fetchone()
            cursor.close()
            return dict(row) if row else None
        except Exception as e:
            sys.stderr.write(f"Failed to execute SQL query get_video_by_id: {e}")
        return None
