from dataclasses import dataclass, asdict

@dataclass
class TranscodeSettings:
    file_path: str
    input_height: str
    output_framerate: str

    def to_dict(self):
        return asdict(self)
