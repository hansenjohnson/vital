import os
import subprocess
import json
import sys

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
            print_err.error("ffprobe error: %s", error)

        metadata_obj = json.loads(metadata_json)
        try:
            metadata = metadata_obj["streams"][0]
        except KeyError:
            print_err("No FFprobe metadata was found at path %s", video_path)
            return None

        frame_rate = self.parse_frame_rate_str(metadata.get("r_frame_rate"))
        num_frames = self.calculate_num_frames(metadata, frame_rate)
        return MediaMetadata(
            file_name=os.path.basename(video_path),
            file_path=video_path,
            width=metadata['width'],
            height=metadata['height'],
            duration=metadata['duration'],
            num_frames=num_frames,
            frame_rate=frame_rate,
            size=os.path.getsize(video_path),
            created_date=os.path.getctime(video_path),
            modified_date=os.path.getmtime(video_path),
            validation_status=None
        )

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
