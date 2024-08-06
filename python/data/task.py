import json
from dataclasses import dataclass, asdict

from data.transcode_settings import TranscodeSettings


@dataclass
class Task:
    id: int
    job_id: int
    status: str
    transcode_settings: TranscodeSettings
    error_message: str

    def to_dict(self):  
        return asdict(self) 


