import { part1, part2 } from "./day18";
import { readFileLines } from "../utils";

const main = () => {
  const lines = readFileLines("src/day18/input.txt");

  console.log(part2(lines));
};
main();
