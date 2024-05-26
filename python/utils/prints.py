import sys

def print_out(*args, **kwargs):
    print(*args, flush=True, **kwargs)

def print_err(*args, **kwargs):
    print(*args, file=sys.stderr, flush=True, **kwargs)
