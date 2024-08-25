import sys


def print_out(*args, **kwargs):
    print(*args, flush=True, **kwargs)


def print_err(*args, **kwargs):
    print(*args, file=sys.stderr, flush=True, **kwargs)

class retry_logger:
    @staticmethod
    def warning(fmt, error, delay):
        print_err(f'Error Caught By Retry Decorator: {error}')
