import { readFileSync } from "fs";

export const readFileLines = (path: string): string[] => {
  return readFileSync(path, "utf-8").split("\n");
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
