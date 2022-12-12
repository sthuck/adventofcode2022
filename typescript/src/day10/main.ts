import { readFileLines, reducers } from "../utils";
import { Machine } from "./day10";
import { max } from "lodash";
import { CRT } from "./crt";
const main = () => {
  const lines = readFileLines("src/day10/input.txt");
  const m = Machine.parse(lines);
  const cyclesToCheck = [20, 60, 100, 140, 180, 220];
  const states = m.runCycles(max(cyclesToCheck)!);
  console.log(
    cyclesToCheck.map((c) => states[c].X * c).reduce(reducers.sumNum, 0)
  );
};

const part2 = () => {
  const lines = readFileLines("src/day10/input.txt");
  const m = Machine.parse(lines);
  m.addPlugin(new CRT().withSlowMode());

  m.runCycles(240);
};

part2();
