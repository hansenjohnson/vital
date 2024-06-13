import subprocess
import os
import sys
from model.video_model import VideoModel
from model.folder_model import FolderModel
from model.still_export_model import StillExportModel
from settings.settings_service import SettingsService
from settings.settings_enum import SettingsEnum
from utils import file_path
from utils.prints import print_err, print_out
from utils.video import frame_rate_from_str, timestamp_for_ffmpeg

settings_service = SettingsService()


class StillExportService:

    def __init__(self):
        self.video_model = VideoModel()
        self.still_export_model = StillExportModel()
        self.folder_model = FolderModel()
        base_dir = os.path.dirname(os.path.abspath(sys.argv[0]))

        self.ffmpeg_path = os.path.join(base_dir, 'resources', 'ffmpeg.exe')
        if not os.path.isfile(self.ffmpeg_path):
            print_err(f"ffmpeg.exe does not exist at {self.ffmpeg_path}")
            raise FileNotFoundError(f"ffmpeg.exe does not exist at {self.ffmpeg_path}")

    def create_still(self, catalog_video_id, output_image_name, frame_number):
        try:
            catalog_video = self.video_model.get_video_by_id(catalog_video_id)
            frame_rate = frame_rate_from_str(catalog_video['FrameRate'])
            timestamp = timestamp_for_ffmpeg(frame_number, frame_rate)

            output_image_path = settings_service.get_setting(SettingsEnum.STILLEXPORT_DIR_PATH.value)
            video_folder_path = file_path.catalog_folder_path(
                catalog_video['CatalogFolderId'],
                SettingsEnum.BASE_FOLDER_OF_VIDEOS.value
            )
            video_name = catalog_video['OptimizedFileName']

            folder_by_id = self.folder_model.get_folder_by_id(catalog_video['CatalogFolderId'])
            catalog_folder_subdir = file_path.catalog_folder_subdir(
                folder_by_id['FolderYear'],
                folder_by_id['FolderMonth'],
                folder_by_id['FolderDay'],
                folder_by_id['ObserverCode']
            )

            video_file_path = os.path.join(video_folder_path, video_name)
            output_dir = os.path.join(output_image_path, catalog_folder_subdir)
            os.mkdir(output_dir) if not os.path.exists(output_dir) else None
            output_file_path = os.path.join(output_dir, output_image_name)

            # this command expects .jpg in the output path, but will not enforce it
            command = [
                self.ffmpeg_path,
                '-loglevel', 'error',
                '-y', # hmm, maybe we need to tell the user if it already exists?
                '-ss', timestamp,
                '-i', video_file_path,
                '-frames:v', '1',
                '-update', '1',
                '-qscale:v', '2',
                output_file_path
            ]

            print_out(' '.join(command))
            try:
                subprocess.run(command, check=True)
            except subprocess.CalledProcessError as e:
                raise e

            if os.path.isfile(output_file_path):
                self.still_export_model.create_still_export({
                    'CatalogVideoId': catalog_video_id,
                    'FileName': output_image_name,
                    'FileLocation': output_image_path,
                    'FrameNumber': frame_number,
                })
                print_out(f"Frame extracted successfully and saved to {output_image_path}")
            else:
                raise Exception(f"Failed to extract frame from video: {video_name}")
        except PermissionError as e:
            # If the Still Export table could not be updated, delete the created image
            # as to not confuse the user with orphaned outputs
            if os.path.exists(output_file_path):
                os.remove(output_file_path)
            raise e
        except Exception as e:
            print_err(f"An error occurred: {e}")
            raise e
