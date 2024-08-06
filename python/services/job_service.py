from model.ingest.job_model import JobModel, JobType
import json

class JobService:
    def __init__(self):
        self.job_model = JobModel()

    def create_job(self, job_type: JobType):
        return self.job_model.create(job_type)

    def store_job_data(self, job_id, data):
        json_data = json.dumps(data)
        self.job_model.store_data(job_id, json_data)

    def get_job_data(self, job_id):
        return json.loads(self.job_model.get_data(job_id))

    def check_job_status(self, job_id):
        return self.job_model.get_status(job_id)
