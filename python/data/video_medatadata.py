from dataclasses import dataclass, asdict
from data.validation_status import ValidationStatus

@dataclass
class VideoMetadata:
    file_name: str
    width: str
    height: str
    duration: str
    frame_rate:str
    size: str
    validation_status: ValidationStatus

    def to_dict(self):
        return asdict(self)
