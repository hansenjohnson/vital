from dataclasses import dataclass, asdict
from data.validation_status import ValidationStatus

@dataclass
class MediaMetadata:
    file_name: str
    file_path: str
    width: str
    height: str
    duration: str
    num_frames: int
    frame_rate:str
    size: str
    validation_status: ValidationStatus
    created_date: str
    modified_date: str

    def to_dict(self):
        return asdict(self)
