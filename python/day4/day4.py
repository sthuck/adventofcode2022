from utils import read_file_to_lines


class Elf:
    start: int
    stop: int

    def __init__(self, r: str):
        start, stop = r.split('-')
        self.start = int(start)
        self.stop = int(stop)

    def contains(self, other: 'Elf'):
        return other.start >= self.start and other.stop <= self.stop

    def overlap(self, other: 'Elf'):
        my_set = set(range(self.start, self.stop + 1))
        other_set = set(range(other.start, other.stop + 1))
        return len(my_set.intersection(other_set)) > 0


def parser(line: str) -> (Elf, Elf):
    elf1input, elf2input = line.split(',')
    return Elf(elf1input), Elf(elf2input)


def main():
    lines = read_file_to_lines("day4/input.txt")
    pairs = [parser(line) for line in lines]
    print(sum([1 for elf1, elf2 in pairs if elf1.contains(elf2) or elf2.contains(elf1)]))
    # part2
    print(sum([1 for elf1, elf2 in pairs if elf1.overlap(elf2)]))


if __name__ == '__main__':
    main()