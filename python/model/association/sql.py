import pandas as pd
import sqlite3
import os

from settings.settings_service import SettingsService
from utils.prints import print_err
from model.config import DB_NAME


class SQL:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(SQL, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        self.df = pd.DataFrame()
        self.conn = sqlite3.connect(DB_NAME, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self.worksheet_name = None

        self.settings = SettingsService()

    def load_table(self, table_name, create_table_statement, file_path, index_col):
        try:
            base_name = os.path.basename(file_path)
            self.worksheet_name = os.path.splitext(base_name)[0]

            cursor = self.conn.cursor()
            cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
            cursor.execute(create_table_statement)
            self.df = pd.read_excel(file_path, self.worksheet_name, index_col=index_col, engine='openpyxl')
            self.df.to_sql(table_name, self.conn, if_exists='append')
            self.conn.commit()
            cursor.close()
        except Exception as e:
            print_err(f"Failed to load sql for {table_name}: {e}")
            raise e

    def get_all_rows(self, table_name):
        try:
            cursor = self.conn.cursor()
            cursor.execute(f"SELECT * FROM {table_name}")
            rows = cursor.fetchall()
            cursor.close()
            return [dict(row) for row in rows]
        except Exception as e:
            print_err(f"Failed to get all rows from {table_name}: {e}")
            raise e

    def flush_to_excel(self, table_name, file_path, sheet_name):
        try:
            self.df = pd.read_sql_query(f"SELECT * FROM {table_name}", self.conn)
            self.df.to_excel(excel_writer=file_path, sheet_name=sheet_name, index=False)
        except Exception as e:
            print_err(f"Failed to flush SQL to excel: {e}")
            raise e
