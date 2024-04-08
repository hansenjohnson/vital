import sys
import json
import pandas as pd
from sqlalchemy import create_engine, text
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

        self.load_sql()

    def load_sql(self):
        try:
            with self.engine.connect() as connection:
                connection.execute(text("DROP TABLE IF EXISTS association"))
                connection.execute(text("""
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
                     """))
                self.df = pd.read_excel(self.settings.get_association_file_path(),
                                        self.settings.get_association_sheet_name(),
                                        index_col='AssociationId')
                self.df.to_sql('association', self.engine, if_exists='append')
                connection.commit()
        except Exception as e:
            sys.stderr.write(f"Failed to execute SQL query: {e}")
            self.settings.clear_file_settings()

    def get_all_associations(self):
        rows = []
        try:
            with self.engine.connect() as connection:
                result = connection.execute(text(f'SELECT * FROM association'))
                for row in result:
                    rows.append(row._asdict())
                return rows
        except Exception as e:
            sys.stderr.write(f"Failed to execute SQL query: {e}")
        return None

    def get_association_by_id(self, catalog_video_id):
        rows = []
        try:
            with self.engine.connect() as connection:
                result = connection.execute(text(f'SELECT * FROM association WHERE AssociationId = {catalog_video_id}'))
                for row in result:
                    rows.append(row._asdict())
                return rows
        except Exception as e:
            sys.stderr.write(f"Failed to execute SQL query: {e}")
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
            sys.stderr.write(f"Failed to execute SQL query: {e}")
            raise

    def delete_association_by_id(self, catalog_video_id):
        try:
            with self.engine.connect() as connection:
                connection.execute(text(f"DELETE FROM association WHERE AssociationId = {catalog_video_id}"))
                connection.commit()

                self.flush_to_excel('association', self.settings.get_association_file_path(), self.settings.get_association_sheet_name())
        except Exception as e:
            sys.stderr.write(f"Failed to execute SQL query: {e}")
            raise

    def flush_to_excel(self, table_name, file_path, sheet_name):
        try:
            with self.engine.connect() as connection:
                sql_query = text(f"SELECT * FROM {table_name}")
                results = connection.execute(sql_query)
                self.df = pd.DataFrame(results.fetchall())
                self.df.to_excel(excel_writer=file_path, sheet_name=sheet_name, index=False)
        except Exception as e:
            sys.stderr.write(f"Failed to flush SQL to excel: {e}")
            raise
