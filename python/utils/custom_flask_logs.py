import logging
import re

class FilterRequestLogs(logging.Filter):
    # Before: 192.168.0.102 - - [30/Jun/2024 01:14:03] "%s" %s %s
    # After: 01:14:03 %s %s %s
    pattern: re.Pattern = re.compile(r'.+ - - \[.+?\s(.+)\] "%s" %s %s')
    def filter(self, record: logging.LogRecord) -> bool:
        record.msg = self.pattern.sub('\\1 %s %s %s', record.msg)
        return True
