import sqlite3
import json
import contextlib

from model.config import DB_PATH
from data.transcode_settings import TranscodeSettings
from data.task import Task, TaskStatus

class TaskModel:
    def __init__(self, db_name=DB_PATH):
        self.db_name = db_name
        self.with_cursor("""
               CREATE TABLE IF NOT EXISTS task (
                   id INTEGER PRIMARY KEY,
                   job_id INTEGER,
                   status TEXT,
                   progress INTEGER DEFAULT 0,
                   progress_message TEXT,
                   transcode_settings TEXT,
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

    def create(self, job_id: int, transcode_settings: TranscodeSettings) -> int:
        transcode_settings_json = self.serialize_dataclass(transcode_settings)
        lastrowid = self.with_cursor(
            "INSERT INTO task (job_id, transcode_settings, status) VALUES (?, ?, ?)",
            (job_id, transcode_settings_json, TaskStatus.QUEUED.value,),
            attr='lastrowid'
        )
        return lastrowid

    def get_transcode_settings(self, task_id: int) -> TranscodeSettings:
        row = self.with_cursor(
            "SELECT transcode_settings FROM task WHERE id = ?",
            (task_id,),
            action='fetchone'
        )
        transcode_settings_json = row[0]
        transcode_settings = self.deserialize_dataclass(transcode_settings_json, TranscodeSettings)
        return transcode_settings

    def get_all_task_ids_by_status(self, job_id: int, status: TaskStatus):
        task_ids = self.with_cursor(
            "SELECT id FROM task WHERE job_id = ? AND status = ?",
            (job_id, status.value),
            action='fetchall'
        )
        return [task_id for (task_id,) in task_ids]

    def get_tasks_by_job_id(self, job_id) -> str:
        tasks_data = self.with_cursor(
            "SELECT * FROM task WHERE job_id = ?",
            (job_id,),
            action='fetchall'
        )
        tasks = []
        for task_data in tasks_data:
            task_id, job_id, status, progress, progress_message, transcode_settings_json, error_message = task_data
            task = Task(
                id=task_id,
                job_id=job_id,
                status=status,
                progress=progress,
                progress_message=progress_message,
                transcode_settings=json.loads(transcode_settings_json),
                error_message=error_message
            )
            tasks.append(task)
        return tasks

    def update_task_status(self, task_id: int, status: TaskStatus):
        self.with_cursor("UPDATE task SET status = ? WHERE id = ?", (status.value, task_id))

    def update_task_progress(self, task_id: int, progress: int, message: str = ''):
        query = "UPDATE task SET progress = ?"
        params = (progress,)
        if message:
            query += ", progress_message = ?"
            params += (message,)
        query += " WHERE id = ?"
        params += (task_id,)
        self.with_cursor(query, params)

    def set_task_error_message(self, task_id: int, error_message: str):
        self.with_cursor("UPDATE task SET error_message = ? WHERE id = ?", (error_message, task_id))

    def delete_by_job_id(self, job_id):
        self.with_cursor("DELETE FROM task WHERE job_id = ? AND status != 'COMPLETED'", (job_id, ))

    def delete_old_tasks(self):
        ids_to_delete = self.with_cursor("SELECT * from task WHERE job_id IN (SELECT j.id FROM job j WHERE j.completed_date < DATE('now', '-10 days') AND j.status = ?)", (TaskStatus.COMPLETED.value,), action='fetchall')
        self.with_cursor("DELETE FROM task WHERE job_id IN (SELECT j.id FROM job j WHERE j.completed_date < DATE('now', '-10 days') AND j.status = ?)", (TaskStatus.COMPLETED.value,))
        if ids_to_delete:
            return [row[0] for row in ids_to_delete]
        return []