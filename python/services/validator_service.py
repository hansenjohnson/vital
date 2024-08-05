import os
from data.validation_status import ValidationStatus

class ValidatorService:


    LENGTH_ERROR = 'LENGTH_ERROR'
    VIDEO_PATH_WARNING = 'VIDEO_PATH_WARNING'
    VIDEO_PATH_ERROR = 'VIDEO_PATH_ERROR'

    VALID = 'VALID'
    
    MAX_LENGTH = 20

    def validate_video(self, source_dir, video_path):
        validation_status = ValidationStatus()

        if not self.validate_length(video_path):
            validation_status.errors.append(self.LENGTH_ERROR)

        validate_path = self.validate_path(source_dir, video_path)
        
        if validate_path == self.VIDEO_PATH_WARNING:
            validation_status.warnings.append(self.VIDEO_PATH_WARNING)
        
        if validate_path == self.VIDEO_PATH_ERROR:
            validation_status.errors.append(self.VIDEO_PATH_ERROR)

        return validation_status

    
    def validate_length(self, input_path):
        return len(os.path.basename(input_path)) <= self.MAX_LENGTH
    
    
    def validate_path(self, source_dir, video_path):
        if self.is_direct_parent(source_dir, video_path):
            return self.VALID
        
        if self.is_second_descendant(source_dir, video_path):
            return self.VIDEO_PATH_WARNING
        
        return self.VIDEO_PATH_ERROR

    def is_direct_parent(self, source_dir, file_path):
        parent_dir = os.path.dirname(file_path)
        return os.path.abspath(parent_dir) == os.path.abspath(source_dir)
    
    def is_second_descendant(self, source_dir, file_path):
        parent_dir = os.path.dirname(file_path)
        grandparent_dir = os.path.dirname(parent_dir)
        return os.path.abspath(grandparent_dir) == os.path.abspath(source_dir)
    