from dataclasses import dataclass, asdict, replace

@dataclass
class Report:
    job_id: int = 0
    source_folder_path: str = ''
    source_folder_size: int = 0
    source_folder_media_count: int = 0
    original_folder_path: str = ''
    original_folder_size: int = 0
    original_folder_media_count: int = 0
    optimized_folder_path: str = ''
    optimized_folder_size: int = 0
    optimized_folder_media_count: int = 0
    output_file: str = None

    def to_dict(self):
        return asdict(self)

    @staticmethod
    def merge_dataclasses(obj1, obj2):
        merged = replace(obj1, **{k: v for k, v in vars(obj2).items() if v is not None})
        return merged
