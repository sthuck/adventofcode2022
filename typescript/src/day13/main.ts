import { readFileLines, reducers } from "../utils";
import {
  CompareResult,
  compareItems,
  compareListItems,
  parseLines,
  parseLine,
} from "./day13";

const main = () => {
  const lines = readFileLines("src/day13/input.txt");
  const pairs = parseLines(lines);
  const result = pairs
    .map((pair, index) =>
      pair.compare() === CompareResult.Ordered ? index + 1 : 0
    )
    .reduce(reducers.sumNum);
  console.log(result);
};

const part2 = () => {
  const lines = readFileLines("src/day13/input.txt")
    .filter((s) => !!s)
    .concat([`[[2]]`, `[[6]]`]);
  const sorted = lines.sort((a, b) => {
    const result = compareItems(parseLine(a), parseLine(b));
    return result === CompareResult.Ordered
      ? -1
      : result === CompareResult.Unordered
      ? 1
      : 0;
  });
  const index1 = sorted.findIndex((line) => line === `[[2]]`);
  const index2 = sorted.findIndex((line) => line === `[[6]]`);
  console.log((index1 + 1) * (index2 + 1));
};

part2();
