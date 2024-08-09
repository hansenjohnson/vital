from dataclasses import dataclass, asdict

@dataclass
class TranscodeSettings:
    file_path: str

    output_framerate: str

    # replace with actual settings
    settings: str


    def to_dict(self):
        return asdict(self)
