import unittest
import os

from services.ingest_service import IngestService

ingest_service = IngestService()


class TestIngestService(unittest.TestCase):

    def test_get_file_metadata(self):
        test_source_dir = os.path.abspath('./test/test_services/test_ingest_service.py')
        metadata = ingest_service.get_file_metadata(test_source_dir)

    def test_count_media(self):
        test_source_dir = os.path.abspath('./test/test_services/test_source')
        media_count = ingest_service.count_media(test_source_dir)
        self.assertEqual(media_count['images'], 2)
        self.assertEqual(media_count['videos'], 3)

    # still in development
    def test_get_video_info(self):
        test_video_path = os.path.abspath('./test/test_services/test_video/CWR-2021-07-18_DSC_0445.MOV')
        video_info = ingest_service.get_video_info(test_video_path)
        self.assertAlmostEqual(video_info['resolution'], '1920\rx1080\r')
        self.assertAlmostEqual(video_info['frame_rate'], 59.94)
        self.assertEqual(video_info['duration'], '39')
        self.assertEqual(video_info['file_size'], 108)