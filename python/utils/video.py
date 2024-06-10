import math
import re

def frame_rate_from_str(frame_rate_str):
    if '/' in frame_rate_str:
        numerator, denominator = map(float, frame_rate_str.split('/'))
        return numerator / denominator
    return float(frame_rate_str)


def timestamp_for_ffmpeg(frame_number, frame_rate):
    total_seconds = frame_number / (frame_rate * 1.0)
    hours = f"{math.floor(total_seconds / 3600):02d}"
    minutes = f"{math.floor(total_seconds / 60) % 60:02d}"
    seconds = f"{math.floor(total_seconds % 60):02d}"
    microseconds = f"{math.floor((total_seconds % 1) * 1000):03d}"
    timestamp = f"{hours}:{minutes}:{seconds}.{microseconds}"
    return timestamp
