import { readFileLines, reducers } from "../utils";
import { range } from "lodash";

class Stack {
  list: string[] = [];

  push(...args: string[]) {
    this.list.push(...args);
  }

  pop(n: number) {
    return range(n).map(() => this.list.pop());
  }
  removeFromTop(n: number) {
    return range(n)
      .map(() => this.list.pop())
      .reverse();
  }
  getTop = () => this.list[this.list.length - 1];
}

class Crane {
  constructor(private stacks: Record<number, Stack>) {}

  applyMove(move: Move, keepOrder: boolean = false) {
    const { from, to, howMuch } = move;
    if (keepOrder) {
      const removed = this.stacks[from].removeFromTop(howMuch) as string[];
      this.stacks[to].push(...removed);
    } else {
      const popped = this.stacks[from].pop(howMuch) as string[];
      this.stacks[to].push(...popped);
    }
  }
  getTopAllStacks() {
    return Object.values(this.stacks).map((s) => s.getTop());
  }
}

interface Move {
  from: number;
  to: number;
  howMuch: number;
}

export const parseStacks = (input: string[]): Record<number, Stack> => {
  const columnNames = input[input.length - 1]
    .trim()
    .split(/\s+/)
    .map((s) => s.trim())
    .map((s) => parseInt(s, 10));
  const colSize = 4;
  input = input.slice(0, input.length - 1); //remove last line

  const stacks: Record<number, Stack> = {};
  input.reverse().forEach((line) => {
    columnNames.forEach((name, i) => {
      const stack = stacks[name] || new Stack();
      let index = i * colSize;
      let text = line.slice(index, index + colSize);
      const match = text.match(/\[(\w)\]\s*/);
      if (match) {
        stack.push(match[1]);
      } else if (text.match(/\s+/)) {
      } else {
        throw new Error("Invalid input");
      }
      stacks[name] = stack;
    });
  });

  return stacks;
};
export const parseMoves = (lines: string[]): Move[] => {
  //move 24 from 2 to 8
  return lines.map((line) => {
    const match = line.match(/move (\d+) from (\d+) to (\d+)/);
    const [, howMuch, from, to] = match!;
    return {
      howMuch: parseInt(howMuch, 10),
      from: parseInt(from, 10),
      to: parseInt(to, 10),
    };
  });
};

const parser = (lines: string[]) => {
  const i = lines.findIndex((line) => line === "");
  const craneInput = lines.slice(0, i);
  const moveInput = lines.slice(i + 1);
  const stacks = parseStacks(craneInput);
  const moves = parseMoves(moveInput);
  return { crane: new Crane(stacks), moves };
};

const main = () => {
  const lines = readFileLines("src/day5/input.txt");
  const { crane, moves } = parser(lines);
  moves.forEach((move) => {
    crane.applyMove(move);
  });
  const top = crane.getTopAllStacks().join("");
  console.log(top);
  //part2
  {
    const { crane, moves } = parser(lines);
    moves.forEach((move) => {
      crane.applyMove(move, true);
    });
    const top = crane.getTopAllStacks().join("");
    console.log(top);
  }
};

main();
