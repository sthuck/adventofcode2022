import { readFileLines } from "../utils";
import { Board, parser } from "./day14";
const main = () => {
  const lines = readFileLines("src/day14/input.txt");
  const b = parser(lines);
  const i = b.runSim("bottom", true);
  // b.print();
  console.log("result: ", i - 1);
};

const part2 = () => {
  const lines = readFileLines("src/day14/input.txt");
  const b = parser(lines);
  const i = b.runSim("top", false);
  // b.print();
  console.log("result: ", i);
};

// main();
part2();
