import { readFileSync } from "fs";

export const readFileLines = (path: string): string[] => {
  return readFileSync(path, "utf-8").split("\n");
};

export const splitLinesByLine = (
  input: string[],
  splitBy: string
): string[][] => {
  const result: string[][] = [];
  let current: string[] = [];
  for (const line of input) {
    if (line === splitBy) {
      result.push(current);
      current = [];
    } else {
      current.push(line);
    }
  }
  result.push(current);
  return result;
};

export const reducers = {
  sumNum: (acc: number, curr: number) => acc + curr,
};

export const untilFirst = <T, R>(arr: T[], mapper: (t: T) => R | null): R => {
  for (const t of arr) {
    const r = mapper(t);
    if (r) {
      return r;
    }
  }
  throw new Error("No value found");
};

export const sleep = (milliseconds: number | undefined) =>
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
