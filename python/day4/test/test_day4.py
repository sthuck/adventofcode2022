from day4.day4 import Elf
import pytest


@pytest.mark.parametrize("elf1, elf2",
                         [("5-7", "7-9"), ("2-8", "3-7"),
                          ("6-6", "4-6"), ("2-6", "4-8"), ("3-7", "2-8")])
def test_overlap1(elf1, elf2):
    e1, e2 = Elf(elf1), Elf(elf2)
    assert e1.overlap(e2)


@pytest.mark.parametrize("elf1, elf2",
                         [("5-7", "8-9"), ("2-8", "9-10"),])
def test_overlap_false(elf1, elf2):
    e1, e2 = Elf(elf1), Elf(elf2)
    assert not e1.overlap(e2)
