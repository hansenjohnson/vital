import sqlite3
import contextlib
from enum import Enum
from datetime import datetime

from utils.prints import print_out

from services.metadata_service import MediaType

from model.config import DB_PATH

class JobStatus(Enum):
    COMPLETED = "COMPLETED"
    QUEUED = "QUEUED"
    INCOMPLETE = "INCOMPLETE"

class JobType(Enum):
    METADATA = "METADATA"
    TRANSCODE = "TRANSCODE"


class JobModel:
    def __init__(self, db_name=DB_PATH):
        self.db_name = db_name
        self.with_cursor("""
               CREATE TABLE IF NOT EXISTS job (
                   id INTEGER PRIMARY KEY,
                   type TEXT,
                   status TEXT,
                   data TEXT,
                   completed_date DATETIME
               )
           """)

    def make_connection(self):
        return sqlite3.connect(self.db_name, check_same_thread=False)

    def with_cursor(self, statement, parameters=None, action=None, attr=None):
        with contextlib.closing(self.make_connection()) as conn: # auto-closes
            with conn: # auto-commits
                with contextlib.closing(conn.cursor()) as cursor: # auto-closes
                    cursor.execute(statement, parameters or ())
                    if action:
                        return cursor.__getattribute__(action)()
                    if attr:
                        return cursor.__getattribute__(attr)

    def create(self, job_type: JobType, jobStatus: JobStatus, json_data):
        lastrowid = self.with_cursor(
            "INSERT INTO job (type, status, data) VALUES (?, ?, ?)",
            (job_type.value, jobStatus.value, json_data,),
            attr='lastrowid'
        )
        return lastrowid

    def store_data(self, job_id, data):
        self.with_cursor(
            "UPDATE job SET status = ?, data = ? WHERE id = ?",
            (JobStatus.COMPLETED.value, data, job_id)
        )

    def get_data(self, job_id):
        row = self.with_cursor(
            "SELECT data FROM job WHERE id = ?",
            (job_id,),
            action='fetchone'
        )
        return row[0]

    def get_job(self, job_id):
        row = self.with_cursor(
            "SELECT * FROM job WHERE id = ?",
            (job_id,),
            action='fetchone'
        )
        return JobModel.transform_job_row(row)

    def get_jobs(self, job_type, completed, limit=None, offset=None):
        base_query = "SELECT * FROM job WHERE type = ?"
        params = [job_type.value]

        if completed:
            base_query += " AND status = ?"
            params.append(JobStatus.COMPLETED.value)
        else:
            base_query += " AND status != ?"
            params.append(JobStatus.COMPLETED.value)

        if limit is not None and offset is not None:
            # if we're limiting, lets apply a meaningful sort order
            base_query += " ORDER BY completed_date DESC"
            # apply the limit
            base_query += " LIMIT ? OFFSET ?"
            params.extend([limit, offset])

        rows = self.with_cursor(base_query, params, action='fetchall')
        jobs = []
        for row in rows:
            job = JobModel.transform_job_row(row)
            jobs.append(job)
        return jobs

    def get_status(self, job_id):
        row = self.with_cursor(
            "SELECT status FROM job WHERE id = ?",
            (job_id,),
            action='fetchone'
        )
        return row[0]

    def set_status(self, job_id, job_status):
        base_query = "UPDATE job SET status = ? "
        params = [job_status.value]
        if job_status == JobStatus.COMPLETED:
            base_query += ", completed_date = ?"
            params.append(datetime.now().isoformat())
        base_query += " WHERE id = ?"
        params.append(job_id)
        self.with_cursor(base_query, params)

    def delete(self, job_id):
        self.with_cursor("DELETE FROM job WHERE id = ?", (job_id,))
        return job_id

    @staticmethod
    def transform_job_row(row):
        if not row:
            return {}
        return {
            "id": row[0],
            "type": row[1],
            "status": row[2],
            "data": row[3],
            "completed_date": row[4]
        }
