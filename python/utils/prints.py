import sys


def print_out(*args, **kwargs):
    safe_str = ' '.join([str(arg) for arg in args]).encode("utf-8")
    print(safe_str, flush=True, **kwargs)


def print_err(*args, **kwargs):
    safe_str = ' '.join([str(arg) for arg in args]).encode("utf-8")
    print(safe_str, file=sys.stderr, flush=True, **kwargs)

class retry_logger:
    @staticmethod
    def warning(fmt, error, delay):
        print_err(f'Error Caught By Retry Decorator: {error}')
