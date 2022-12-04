from dataclasses import dataclass
from typing import List
from utils import read_file_to_lines,split_to_chunks

@dataclass
class Rucksack:
    bag1: List[str]
    bag2: List[str]

    def all_items(self) -> List[str]:
        return self.bag1 + self.bag2

    def common_item(self) -> str:
        return next((item for item in set(self.bag1) if item in set(self.bag2)), None)


def parser(line: str) -> Rucksack:
    items = list(line)
    bag1, bag2 = items[0:len(items)//2], items[len(items)//2:]
    return Rucksack(bag1, bag2)


def chr_to_priority(char: str) -> int:
    if char.isupper():
        return ord(char) - 64 + 26
    if char.islower():
        return ord(char) - 96
    raise ValueError(f"Invalid char: {char}")


def main():
    lines = read_file_to_lines("input.txt")
    sacks = [parser(line) for line in lines]
    print(sum(chr_to_priority(sack.common_item()) for sack in sacks))
    #part2
    def find_common_in_sacks(sacks: List[Rucksack]) -> str:
        first = sacks[0]
        others = sacks[1:]
        return next((item for item in first.all_items() if all(item in sack.all_items() for sack in others)), None)
    rucksack_groups = split_to_chunks(sacks, 3)
    print(sum(chr_to_priority(find_common_in_sacks(group)) for group in rucksack_groups))


if __name__ == '__main__':
    main()
