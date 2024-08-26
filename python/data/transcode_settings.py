from dataclasses import dataclass, asdict

@dataclass
class TranscodeSettings:
    file_path: str
    input_height: str = ''
    num_frames: int = ''
    output_framerate: str = ''
    local_export_path: str = ''
    jpeg_quality: str = ''
    new_name: str = ''

    def to_dict(self):
        return asdict(self)
