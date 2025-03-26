from dataclasses import dataclass, asdict
from data.validation_status import ValidationStatus

@dataclass
class MediaMetadata:
    flawed: bool
    file_name: str
    file_path: str
    size: str
    created_date: str
    modified_date: str

    width: str = None
    height: str = None
    duration: str = None
    num_frames: int = None
    frame_rate:str = None
    validation_status: ValidationStatus = None
    original_date: str = None

    def to_dict(self):
        return asdict(self)
