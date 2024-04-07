import sys
import json
import pandas as pd
from sqlalchemy import create_engine, text, insert, table, inspect
from settings.settings_service import SettingsService


class SQL:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(SQL, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        self.df = pd.DataFrame()
        self.engine = create_engine('sqlite:///video_catalog.db')
        self.settings = SettingsService()

        file_path = self.settings.get_association_file_path()
        sheet_name = self.settings.get_association_sheet_name()

        if file_path is not None and sheet_name is not None:
            self.load_sql()

    def load_sql(self):
        self.df = pd.read_excel(self.settings.get_association_file_path(),
                                self.settings.get_association_sheet_name(),
                                index_col='CatalogVideoId')

        with self.engine.connect() as connection:
            connection.execute(text("DROP TABLE IF EXISTS association"))
            connection.execute(text("""
                     CREATE TABLE association (
                        CatalogVideoId INTEGER PRIMARY KEY AUTOINCREMENT,
                        SightingId INTEGER,
                        StartTime TEXT,
                        EndTime TEXT,
                        Annotation JSON,
                        CreatedBy TEXT,
                        CreatedDate TEXT
                     )
                 """))

            self.df.to_sql('association', self.engine, if_exists='append')

    def get_association_table(self):
        rows = []
        try:
            with self.engine.connect() as connection:
                result = connection.execute(text(f'SELECT * FROM association'))
                for row in result:
                    rows.append(row._asdict())
                return rows
        except Exception as e:
            print(f"Failed to execute SQL query: {e}")
        return None

    def get_association_by_id(self, catalog_video_id):
        rows = []
        try:
            with self.engine.connect() as connection:
                result = connection.execute(text(f'SELECT * FROM association WHERE CatalogVideoId = {catalog_video_id}'))
                for row in result:
                    rows.append(row._asdict())
                return rows
        except Exception as e:
            print(f"Failed to execute SQL query: {e}")
        return None

    def create_association(self, payload):
        try:
            payload['Annotation'] = json.dumps(payload['Annotation'])
            with self.engine.connect() as connection:
                query = text("INSERT INTO association (SightingId, StartTime, EndTime, Annotation, CreatedBy, CreatedDate) "
                             "VALUES (:SightingId, :StartTime, :EndTime, :Annotation, :CreatedBy, :CreatedDate)")
                connection.execute(query, payload)
                connection.commit()

                self.flush_to_excel('association', self.settings.get_association_file_path(), self.settings.get_association_sheet_name())

        except Exception as e:
            print(f"Failed to execute SQL query: {e}")
            raise

    def flush_to_excel(self, table_name, file_path, sheet_name):
        try:
            with self.engine.connect() as connection:
                sql_query = text(f"SELECT * FROM {table_name}")
                results = connection.execute(sql_query)
                self.df = pd.DataFrame(results.fetchall())
                self.df.to_excel(excel_writer=file_path, sheet_name=sheet_name, index=False)
        except Exception as e:
            print(f"Failed to flush SQL to excel: {e}")
            raise
