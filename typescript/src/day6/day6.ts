import { reducers } from "../utils";
enum CommandTypes {
  "IntoDir",
  "OutDir",
  "ListDir",
}
interface IntoDirCommand {
  type: CommandTypes.IntoDir;
  dir: string;
}
interface OutDirCommand {
  type: CommandTypes.OutDir;
}
interface ListDirCommand {
  type: CommandTypes.ListDir;
}
type Command = IntoDirCommand | OutDirCommand | ListDirCommand;

const parseCommand = (line: string): Command => {
  if (line.startsWith("$ ls")) {
    return { type: CommandTypes.ListDir };
  } else if (line.startsWith("$ cd ..")) {
    return { type: CommandTypes.OutDir };
  } else if (line.startsWith("$ cd")) {
    return { type: CommandTypes.IntoDir, dir: line.split(" ")[2] };
  }
  throw new Error("Invalid command");
};

interface IItem {
  getSize(): number;
  traverse(fn: (item: IItem) => void): void;
  name: string;
  isDir(): this is Dir;
}

export class Dir implements IItem {
  name: string;
  parent: Dir | null;
  children: IItem[];
  private _size: number | null = null;
  constructor(opts: { name: string; parent: Dir | null }) {
    this.name = opts.name;
    this.parent = opts.parent;
    this.children = [];
  }
  addChildren(children: IItem[]) {
    this.children.push(...children);
  }
  findChildDir(name: string): Dir {
    const item = this.children
      .filter((c) => c.isDir())
      .find((c) => c.name === name);
    if (!item) {
      throw new Error("Dir not found");
    }
    return item as Dir;
  }
  traverse(fn: (item: IItem) => void) {
    fn(this);
    this.children.forEach((c) => c.traverse(fn));
  }
  getSize(): number {
    if (this._size) return this._size;
    this._size = this.children
      .map((c) => c.getSize())
      .reduce(reducers.sumNum, 0);
    return this._size;
  }
  isDir(): this is Dir {
    return true;
  }
}

class TFile implements IItem {
  constructor(opts: { name: string; parent: Dir | null; size: number }) {
    this.name = opts.name;
    this.parent = opts.parent;
    this.size = opts.size;
  }
  isDir(): false {
    return false;
  }

  name: string;
  parent: Dir | null;
  size: number;

  getSize() {
    return this.size;
  }
  traverse(fn: (item: IItem) => void) {
    fn(this);
  }
}

const isLineCommand = (line: string) => line.startsWith("$");

export const parseLsOutput = (lines: string[], parent: Dir | null): IItem[] => {
  const items: IItem[] = [];
  lines.forEach((line) => {
    if (line.startsWith("dir")) {
      const name = line.split(" ")[1];
      items.push(new Dir({ name, parent }));
    } else {
      const [sizeStr, name] = line.split(" ");
      const size = parseInt(sizeStr, 10);
      items.push(new TFile({ name, parent, size }));
    }
  });
  return items;
};

const extractLsOutput = (lines: string[]) => {
  let i = lines.findIndex(isLineCommand);
  if (i === -1) {
    i = lines.length;
  }
  return { lsOutput: lines.slice(0, i), restLines: lines.slice(i) };
};

export class Parser {
  public tree = new Dir({ name: "/", parent: null });
  private currentDir!: Dir;
  parse(lines_: string[]) {
    let lines = lines_;
    lines.shift(); //remove first line, it's cd into root
    this.currentDir = this.tree;
    while (lines.length) {
      const line = lines.shift()!;
      const command = parseCommand(line);
      switch (command.type) {
        case CommandTypes.IntoDir: {
          const { dir } = command;
          this.currentDir = this.currentDir.findChildDir(dir);
          break;
        }
        case CommandTypes.ListDir: {
          const { lsOutput, restLines } = extractLsOutput(lines);
          const children = parseLsOutput(lsOutput, this.currentDir);
          this.currentDir.addChildren(children);
          lines = restLines;
          break;
        }
        case CommandTypes.OutDir: {
          this.currentDir = this.currentDir.parent!;
          break;
        }
      }
    }
    return this.tree;
  }
}
