import sqlite3
import json
from enum import Enum
from typing import List

from model.config import DB_NAME
from data.transcode_settings import TranscodeSettings
from data.task import Task, TaskStatus

class TaskModel:
    def __init__(self, db_name=DB_NAME):
        self.db_name = db_name
        self.conn = sqlite3.connect(self.db_name, check_same_thread=False)
        self.cursor = self.conn.cursor()

        self.cursor.execute("""
               CREATE TABLE IF NOT EXISTS task (
                   id INTEGER PRIMARY KEY,
                   job_id INTEGER,
                   status TEXT,
                   progress INTEGER DEFAULT 0,
                   transcode_settings TEXT,
                   error_message TEXT
               )
           """)

        self.conn.commit()

    def serialize_dataclass(self, instance):
        return json.dumps(instance.__dict__)

    def deserialize_dataclass(self, json_string, cls):
        return cls(**json.loads(json_string))

    def create(self, job_id: int, transcode_settings: TranscodeSettings) -> int:
        transcode_settings_json = self.serialize_dataclass(transcode_settings)
        self.cursor.execute("INSERT INTO task (job_id, transcode_settings, status) VALUES (?, ?, ?)", (job_id, transcode_settings_json, TaskStatus.PENDING.value,))
        self.conn.commit()
        return self.cursor.lastrowid

    def get_transcode_settings(self, task_id: int) -> TranscodeSettings:
        self.cursor.execute("SELECT transcode_settings FROM task WHERE id = ?", (task_id,))
        row = self.cursor.fetchone()[0]
        transcode_settings = self.deserialize_dataclass(row, TranscodeSettings)
        return transcode_settings

    def get_all_task_ids_by_status(self, job_id: int, status: TaskStatus):
        self.cursor.execute("SELECT id FROM task WHERE job_id = ? AND status = ?", (job_id, status.value))
        task_ids =  self.cursor.fetchall()

        return [task_id for (task_id,) in task_ids]

    def get_tasks_by_job_id(self, job_id) -> str:
        self.cursor.execute("SELECT id, job_id, status, progress, transcode_settings, error_message FROM task WHERE job_id = ?", (job_id,))
        tasks_data = self.cursor.fetchall()
        tasks = []
        for task_data in tasks_data:
            task_id, job_id, status, progress, transcode_settings_json, error_message = task_data
            task = Task(
                id=task_id,
                job_id=job_id,
                status=status,
                progress=progress,
                transcode_settings=transcode_settings_json,
                error_message=error_message
            )
            tasks.append(task)
        return tasks

    def update_task_status(self, task_id: int, status: TaskStatus):
        self.cursor.execute("UPDATE task SET status = ? WHERE id = ?", (status.value, task_id))
        self.conn.commit()

    def update_task_progress(self, task_id: int, progress: int):
        self.cursor.execute("UPDATE task SET progress = ? WHERE id = ?", (progress, task_id))
        self.conn.commit()

    def set_task_error_message(self, task_id: int, error_message: str):
        self.cursor.execute("UPDATE task SET error_message = ? WHERE id = ?", (error_message, task_id))
        self.conn.commit()
