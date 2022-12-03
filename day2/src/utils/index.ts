import { readFileSync } from "fs";

export const readFileLines = (path: string): string[] => {
  return readFileSync(path, "utf-8").split("\n");
};

export const reducers = {
  sumNum: (acc: number, curr: number) => acc + curr,
};
