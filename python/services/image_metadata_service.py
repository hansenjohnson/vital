import os
import sys
import subprocess
import json

from services.metadata_service import MetadataService
from data.media_medatadata import MediaMetadata

from utils.prints import print_out, print_err

class ImageMetadataService(MetadataService):

    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
        self.exiftool_path = os.path.join(base_dir, 'resources', 'exiftool.exe')
        if not os.path.isfile(self.exiftool_path):
            print_err(f"exiftool.exe does not exist at {self.exiftool_path}")
            raise FileNotFoundError(f"exiftool.exe does not exist at {self.exiftool_path}")

    def parse_metadata(self, file_path):
        command = [self.exiftool_path, "-j", file_path]
        print_out(" ".join(command))
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        metadata_json, error = process.communicate()
        if error:
            print_err("exiftool error: %s", error)
        metadata_obj = json.loads(metadata_json)
        try:
            metadata = metadata_obj[0]
        except KeyError:
            print_err.error("No Exiftool metadata was found at path %s", file_path)
            return None
        return MediaMetadata(
            file_name=metadata['FileName'],
            file_path=file_path,
            width=metadata['ImageWidth'],
            height=metadata['ImageHeight'],
            size=os.path.getsize(file_path),
            created_date=os.path.getctime(file_path),
            modified_date=os.path.getmtime(file_path),
            validation_status=None,
            duration=None,
            num_frames=None,
            frame_rate=None
        )
