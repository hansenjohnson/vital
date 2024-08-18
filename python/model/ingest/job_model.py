import sqlite3
from enum import Enum

from model.config import DB_PATH

class JobStatus(Enum):
    COMPLETED = "COMPLETED"
    ERROR = "ERROR"
    QUEUED = "QUEUED"
    INCOMPLETE = "INCOMPLETE"

class JobType(Enum):
    METADATA = "METADATA"
    TRANSCODE = "TRANSCODE"


class JobModel:
    def __init__(self, db_name=DB_PATH):
        self.db_name = db_name
        self.conn = sqlite3.connect(self.db_name, check_same_thread=False)
        self.cursor = self.conn.cursor()

        self.cursor.execute("""
               CREATE TABLE IF NOT EXISTS job (
                   id INTEGER PRIMARY KEY,
                   type TEXT,
                   status TEXT,
                   data TEXT
               )
           """)

        self.conn.commit()

    def create(self, job_type: JobType, jobStatus: JobStatus, json_data):
        self.cursor.execute("INSERT INTO job (type, status, data) VALUES (?, ?, ?)", (job_type.value, jobStatus.value, json_data))
        self.conn.commit()
        return self.cursor.lastrowid

    def store_data(self, job_id, data):
        self.cursor.execute("UPDATE job SET status = ?, data = ? WHERE id = ?", (JobStatus.COMPLETED.value, data, job_id))
        self.conn.commit()

    def get_data(self, job_id):
        self.cursor.execute("SELECT data FROM job WHERE id = ?", (job_id,))
        return self.cursor.fetchone()[0]
    
    def get_non_complete_jobs(self, job_type):
        self.cursor.execute("SELECT * FROM job WHERE type = ? AND status != 'COMPLETED'", (job_type.value,))
        rows = self.cursor.fetchall()
        jobs = []
        for row in rows:
            job = {
                "id": row[0],
                "type": row[1],
                "status": row[2],
                "data": row[3]
            }
            jobs.append(job)
        return jobs

    def get_status(self, job_id):
        self.cursor.execute("SELECT status FROM job WHERE id = ?", (job_id,))
        return self.cursor.fetchone()[0]
    
    def set_status(self, job_id, job_status):
        self.cursor.execute("UPDATE job SET status = ? where id = ?", (job_status.value, job_id,))
        self.conn.commit()

    def delete(self, job_id):
        self.cursor.execute("DELETE FROM job WHERE id = ?", (job_id,))
        self.conn.commit()
        return job_id