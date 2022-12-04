from typing import List, Any, TypeVar


def read_file_to_lines(path: str) -> List[str]:
    with open(path, 'r') as f:
        return f.readlines()


T = TypeVar('T')


def split_to_chunks(arr: List[T], chunk_size) -> List[List[T]]:
    return [arr[i:i + chunk_size] for i in range(0, len(arr), chunk_size)]
