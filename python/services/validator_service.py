import os

from datetime import datetime
from data.validation_status import ValidationStatus
from services.metadata_service import MediaType

from utils.prints import print_out

class ValidatorService:


    LENGTH_ERROR = 'LENGTH_ERROR'
    MEDIA_PATH_WARNING = 'MEDIA_PATH_WARNING'
    MEDIA_PATH_ERROR = 'MEDIA_PATH_ERROR'

    INCORRECT_CREATED_TIME = 'INCORRECT_CREATED_TIME'

    VALID = 'VALID'

    MAX_LENGTH = 20

    def validate_media(self, source_dir, media_metadata, media_type):
        validation_status = ValidationStatus()

        if not self.validate_length(media_metadata.file_path):
            validation_status.errors.append(self.LENGTH_ERROR)

        if not self.validate_media_date(source_dir, media_metadata):
            validation_status.warnings.append(self.INCORRECT_CREATED_TIME)

        validate_path = self.validate_path(source_dir, media_metadata.file_path, media_type)

        if validate_path == self.MEDIA_PATH_WARNING:
            validation_status.warnings.append(self.MEDIA_PATH_WARNING)

        if validate_path == self.MEDIA_PATH_ERROR:
            validation_status.errors.append(self.MEDIA_PATH_ERROR)

        return validation_status


    def validate_length(self, media_path):
        return len(os.path.basename(media_path)) <= self.MAX_LENGTH


    def validate_media_date(self, source_dir, media_metadata):
        folder_name = os.path.basename(source_dir)

        date_string = '-'.join(folder_name.split('-')[:3])
        folder_date = datetime.strptime(date_string, "%Y-%m-%d").date()

        media_creation_date = datetime.fromtimestamp(media_metadata.created_date).date()

        media_modification_date = datetime.fromtimestamp(media_metadata.modified_date).date()

        return (folder_date == media_creation_date) or (folder_date == media_modification_date)


    def validate_path(self, source_dir, media_path, media_type):
        if self.is_direct_parent(source_dir, media_path):
            return self.VALID

        if self.is_second_descendant(source_dir, media_path):
            if media_type == MediaType.VIDEO:
                return self.MEDIA_PATH_WARNING

        return self.MEDIA_PATH_ERROR


    def is_direct_parent(self, source_dir, file_path):
        parent_dir = os.path.dirname(file_path)
        return parent_dir == source_dir


    def is_second_descendant(self, source_dir, file_path):
        parent_dir = os.path.dirname(file_path)
        grandparent_dir = os.path.dirname(parent_dir)
        return grandparent_dir == source_dir
