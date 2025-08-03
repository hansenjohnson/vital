import os
import sys
import subprocess
import json
from datetime import datetime

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

    def parse_metadata(self, files) -> list:
        command = [self.exiftool_path, "-j"] + files
        print_out(" ".join(command))
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        metadata_json, error = process.communicate()

        if error:
            print_err(f"exiftool stderr: {error}")

        metadata_obj_arr = json.loads(metadata_json)

        if not isinstance(metadata_obj_arr, list) or len(metadata_obj_arr) == 0:
            raise ValueError("No metadata found")

        metadata_dict = {}
        for file_path in files:
            metadata_dict[file_path] = MediaMetadata(
                file_name=os.path.basename(file_path),
                file_path=file_path,
                size=os.path.getsize(file_path),
                created_date=os.path.getctime(file_path),
                modified_date=os.path.getmtime(file_path),
                flawed=True
            )

        for metadata in metadata_obj_arr:
            file_path = os.path.normpath(metadata['SourceFile'])
            metadata_obj = metadata_dict[file_path]

            internal_date = metadata.get('DateTimeOriginal')
            if internal_date:
                internal_date = datetime.strptime(internal_date, "%Y:%m:%d %H:%M:%S").timestamp()

            metadata_obj.flawed = False
            metadata_obj.width = metadata['ImageWidth']
            metadata_obj.height = metadata['ImageHeight']
            metadata_obj.original_date = internal_date

        return list(metadata_dict.values())
