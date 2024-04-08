import sys
import json
import pandas as pd
import sqlite3

from settings.settings_service import SettingsService


class SQL:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(SQL, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        self.df = pd.DataFrame()
        self.conn = sqlite3.connect('video_catalog.db', check_same_thread=False)
        self.cursor = self.conn.cursor()
        self.settings = SettingsService()

        self.load_sql()

    def load_sql(self):
        try:
            self.cursor.execute("DROP TABLE IF EXISTS association")
            self.cursor.execute("""
                         CREATE TABLE association (
                            AssociationId INTEGER PRIMARY KEY AUTOINCREMENT,
                            SightingId INTEGER,
                            StartTime TEXT,
                            EndTime TEXT,
                            Annotation JSON,
                            VideFilePath TEXT,
                            ThumbnailFilePath TEXT,
                            CreatedBy TEXT,
                            CreatedDate TEXT
                         )
                     """)
            self.df = pd.read_excel(self.settings.get_association_file_path(),
                                    self.settings.get_association_sheet_name(),
                                    index_col='AssociationId')
            self.df.to_sql('association', self.conn, if_exists='append')
            self.conn.commit()
        except Exception as e:
            sys.stderr.write(f"Failed to execute SQL query: {e}")
            self.settings.clear_file_settings()

    def get_all_associations(self):
        rows = []
        try:
            result = self.cursor.execute('SELECT * FROM association')
            rows = [dict(zip([column[0] for column in result.description], row)) for row in result.fetchall()]
            return rows
        except Exception as e:
            sys.stderr.write(f"Failed to execute SQL query: {e}")
        return None

    def get_association_by_id(self, association_id):
        rows = []
        try:
            result = self.cursor.execute(f'SELECT * FROM association WHERE AssociationId = {association_id}')
            rows = [dict(zip([column[0] for column in result.description], row)) for row in result.fetchall()]
            return rows
        except Exception as e:
            sys.stderr.write(f"Failed to execute SQL query: {e}")
        return None

    def create_association(self, payload):
        try:
            payload['Annotation'] = json.dumps(payload['Annotation'])
            query = "INSERT INTO association (SightingId, StartTime, EndTime, Annotation, CreatedBy, CreatedDate) VALUES (:SightingId, :StartTime, :EndTime, :Annotation, :CreatedBy, :CreatedDate)"
            self.cursor.execute(query, payload)
            self.conn.commit()

            self.flush_to_excel('association', self.settings.get_association_file_path(), self.settings.get_association_sheet_name())
            return self.cursor.lastrowid

        except Exception as e:
            sys.stderr.write(f"Failed to execute SQL query: {e}")
            raise

    def delete_association_by_id(self, catalog_video_id):
        try:
            self.cursor.execute(f"DELETE FROM association WHERE AssociationId = {catalog_video_id}")
            self.conn.commit()

            self.flush_to_excel('association', self.settings.get_association_file_path(), self.settings.get_association_sheet_name())
        except Exception as e:
            sys.stderr.write(f"Failed to execute SQL query: {e}")
            raise

    def flush_to_excel(self, table_name, file_path, sheet_name):
        try:
            self.df = pd.read_sql_query(f"SELECT * FROM {table_name}", self.conn)
            self.df.to_excel(excel_writer=file_path, sheet_name=sheet_name, index=False)
        except Exception as e:
            sys.stderr.write(f"Failed to flush SQL to excel: {e}")
            raise