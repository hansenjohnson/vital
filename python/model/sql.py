import sys
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
        self.conn.row_factory = sqlite3.Row

        self.settings = SettingsService()

    def load_table(self, table_name, create_table_statement, file_path, sheet_name, index_col):
        try:
            cursor = self.conn.cursor()
            cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
            cursor.execute(create_table_statement)
            self.df = pd.read_excel(file_path, sheet_name, index_col=index_col, engine='openpyxl')
            self.df.to_sql(table_name, self.conn, if_exists='append')
            self.conn.commit()
            cursor.close()
        except Exception as e:
            sys.stderr.write(f"Failed to load sql for {table_name}: {e}")
            raise e

    def flush_to_excel(self, table_name, file_path, sheet_name):
        try:
            self.df = pd.read_sql_query(f"SELECT * FROM {table_name}", self.conn)
            self.df.to_excel(excel_writer=file_path, sheet_name=sheet_name, index=False)
        except Exception as e:
            sys.stderr.write(f"Failed to flush SQL to excel: {e}")
            raise e
