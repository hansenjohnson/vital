from abc import ABC, abstractmethod
from enum import Enum

class MediaType(Enum):
    VIDEO = "VIDEO"
    IMAGE = "IMAGE"


class MetadataService(ABC):

    @abstractmethod
    def parse_metadata(self, file_path):
        pass