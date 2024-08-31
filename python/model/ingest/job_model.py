import sqlite3
import contextlib
import json
from enum import Enum
from datetime import datetime

from utils.prints import print_out

from data.report import Report

from services.metadata_service import MediaType

from model.config import DB_PATH

class JobStatus(Enum):
    COMPLETED = "COMPLETED"
    QUEUED = "QUEUED"
    INCOMPLETE = "INCOMPLETE"

class JobType(Enum):
    METADATA = "METADATA"
    TRANSCODE = "TRANSCODE"
    SAMPLE = "SAMPLE"

class JobErrors(Enum):
    NONE = None
    FILE_NOT_FOUND = "FILE_NOT_FOUND"

class JobModel:
    def __init__(self, db_name=DB_PATH):
        self.db_name = db_name
        self.with_cursor("""
               CREATE TABLE IF NOT EXISTS job (
                   id INTEGER PRIMARY KEY,
                   type TEXT,
                   status TEXT,
                   data TEXT,
                   report_data TEXT DEFAULT '{}',
                   completed_date DATETIME,
                   last_executor_id TEXT,
                   error_message TEXT
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
                    

    def serialize_dataclass(self, instance):
        return json.dumps(instance.__dict__)

    def deserialize_dataclass(self, json_string, cls):
        return cls(**json.loads(json_string))

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

    def get_jobs(self, job_type, completed, limit=None, offset=None, current_execution_id=None):
        base_query = "SELECT * FROM job WHERE type = ?"
        params = [job_type.value]

        if completed:
            base_query += " AND status = ?"
            params.append(JobStatus.COMPLETED.value)
        else:
            base_query += " AND status != ?"
            params.append(JobStatus.COMPLETED.value)

        if current_execution_id:
            # uses IS NOT instead of != because NULL values are possible
            base_query += " AND last_executor_id IS NOT ?"
            params.append(current_execution_id)

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

        if current_execution_id:
            job_ids = [job["id"] for job in jobs]
            self.set_executor_for_jobs(job_ids, current_execution_id)

        return jobs

    def set_executor_for_jobs(self, job_ids, executor_id):
        n_jobs = len(job_ids)
        self.with_cursor(
            "UPDATE job SET last_executor_id = ? WHERE id IN (%s)" % ",".join("?" * n_jobs),
            (executor_id, *job_ids)
        )

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

    def set_error(self, job_id, job_error: JobErrors):
        query = "UPDATE job SET error_message = ? WHERE id = ?"
        self.with_cursor(query, (job_error.value, job_id))

    def delete(self, job_id):
        self.with_cursor("DELETE FROM job WHERE id = ?", (job_id,))
        return job_id
    
    def update_report_data(self, job_id, incoming_report_data):
        stored_report_data = self.get_report_data(job_id)
        report_data = Report.merge_dataclasses(stored_report_data, incoming_report_data)
    
        report_data_json = self.serialize_dataclass(report_data)

        self.with_cursor("UPDATE job set report_data = ? where id = ?", (report_data_json, job_id,))
    
    def get_report_data(self, job_id):
         row = self.with_cursor(
            "SELECT report_data FROM job WHERE id = ?",
            (job_id,),
            action='fetchone')
         report_data_json = row[0]
         
         report_data = self.deserialize_dataclass(report_data_json, Report)
         return report_data

    @staticmethod
    def transform_job_row(row):
        if not row:
            return {}
        return {
            "id": row[0],
            "type": row[1],
            "status": row[2],
            "data": row[3],
            "report_data": row[4],
            "completed_date": row[5],
            # "last_executor_id": row[6], // just placing this here for tuple-index reference
            "error_message": row[7],
        }
