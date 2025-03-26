import os
import subprocess
import json
import sys
from datetime import datetime

from data.media_medatadata import MediaMetadata

from services.metadata_service import MetadataService

from utils.prints import print_err, print_out

class VideoMetadataService(MetadataService):

    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
        self.ffprobe_path = os.path.join(base_dir, 'resources', 'ffprobe.exe')
        if not os.path.isfile(self.ffprobe_path):
            print_err(f"ffprobe_path.exe does not exist at {self.ffprobe_path}")
            raise FileNotFoundError(f"ffprobe_path.exe does not exist at {self.ffprobe_path}")

    def parse_metadata(self, file_path):
        return self.ffprobe_metadata(file_path, None)

    def ffprobe_metadata(self, video_path, start_number=None):
        command = [
            self.ffprobe_path,
            "-loglevel",
            "panic",
            "-hide_banner",
            "-show_streams",
            "-select_streams",
            "v",
            "-print_format",
            "json",
            video_path,
        ]
        if start_number:
            command.extend(["-start_number", str(start_number)])
        print_out(f'Running ffprobe command: {" ".join(command)}')
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        metadata_json, error = process.communicate()
        if error:
            print_err(f"ffprobe stderr: {error}")

        metadata_obj = MediaMetadata(
            file_name=os.path.basename(video_path),
            file_path=video_path,
            size=os.path.getsize(video_path),
            created_date=os.path.getctime(video_path),
            modified_date=os.path.getmtime(video_path),
            flawed=True
        )

        metadata_all = json.loads(metadata_json)
        try:
            metadata = metadata_all["streams"][0]
        except KeyError:
            print_err(f"No FFprobe metadata was found at path {video_path}")
            return metadata_obj

        sanity_check = [metadata.get('width', None), metadata.get('height', None), metadata.get('duration', None)]
        if all(sanity_check) == False:
            print_err(f"No FFprobe metadata was found at path {video_path}")
            return metadata_obj

        frame_rate = self.parse_frame_rate_str(metadata.get("r_frame_rate"))
        num_frames = self.calculate_num_frames(metadata, frame_rate)
        internal_date = metadata.get('tags', {}).get('creation_time')
        if internal_date:
            internal_date = datetime.fromisoformat(internal_date).timestamp()

        metadata_obj.flawed = False
        metadata_obj.width = metadata['width']
        metadata_obj.height = metadata['height']
        metadata_obj.duration = metadata['duration']
        metadata_obj.num_frames = num_frames
        metadata_obj.frame_rate = frame_rate
        metadata_obj.original_date = internal_date
        metadata_obj.validation_status = None

        return metadata_obj

    def parse_frame_rate_str(self, frame_rate_str):
        if frame_rate_str:
            rates = frame_rate_str.split("/")
            if len(rates) > 1:
                rate = float(rates[0]) / float(rates[1])
            else:
                rate = float(rates[0])
            return str(rate)
        return ""

    def calculate_num_frames(self, metadata, frame_rate):
        if 'nb_frames' in metadata:
            return int(metadata['nb_frames'])
        else:
            duration = float(metadata['duration'])
            return int(duration * float(frame_rate))
