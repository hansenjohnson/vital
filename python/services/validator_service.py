import os
from data.validation_status import ValidationStatus

class ValidatorService:


    LENGTH_ERROR = 'LENGTH_ERROR'
    VIDEO_PATH_WARNING = 'VIDEO_PATH_WARNING'
    VIDEO_PATH_ERROR = 'VIDEO_PATH_ERROR'

    VALID = 'VALID'
    
    MAX_LENGTH = 20

    def validate_video(self, input_path):
        validation_status = ValidationStatus()

        if not self.validate_length(input_path):
            validation_status.errors.append(self.LENGTH_ERROR)

        validate_path = self.validate_path(input_path)
        
        if validate_path == self.VIDEO_PATH_WARNING:
            validation_status.warnings.append(self.VIDEO_PATH_WARNING)
        
        if validate_path == self.VIDEO_PATH_ERROR:
            validation_status.errors.append(self.VIDEO_PATH_ERROR)

        return validation_status

    
    def validate_length(self, input_path):
        return len(os.path.basename(input_path)) <= self.MAX_LENGTH
    
    
    def validate_path(self, input_path):
        file_path_parts = self.get_path_parts(input_path)


        # if the file is a 2nd descendent in the path of the correct parent, it gets a warning validation status
        # if the file is a 3rd+ decendent, it will recieve an error validation status
        file_index = len(file_path_parts) - 1
        correct_parent_index = file_index - 1
        warning_parent_index = file_index - 2


        file_name = file_path_parts[-1]

        for index, part in enumerate(file_path_parts):
            is_correct_parent = self.is_correct_parent(file_name, part)
            if is_correct_parent and index == correct_parent_index:
                return self.VALID
            
            if is_correct_parent and index == warning_parent_index:
                return self.VIDEO_PATH_WARNING
            
        return self.VIDEO_PATH_ERROR
                

    def get_path_parts(self, file_path):
        parts = []
        while True:
            file_path, tail = os.path.split(file_path)
            if tail:
                parts.insert(0, tail)
            else:
                if file_path:
                    parts.insert(0, file_path)
                break
        return parts
    
    def is_correct_parent(self, file_name, folder):
        cleaned_file_name = self.clean_video_file_name(file_name)
        return ''.join(sorted(folder)) in ''.join(sorted(cleaned_file_name))

    def clean_video_file_name(self, file_name):
        return file_name.split('_')[0]