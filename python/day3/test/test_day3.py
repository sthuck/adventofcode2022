from day3.day3 import parser
import pytest


@pytest.mark.parametrize("test_input,expected",
                         [("vJrwpWtwJgWrhcsFMMfFFhFp", "p"), ("jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL", "L"),
                          ("PmmdzqPrVvPwwTWBwg", "P")])
def test_parser(test_input, expected):
    parsed = parser(test_input)
    assert parsed.common_item() == expected
