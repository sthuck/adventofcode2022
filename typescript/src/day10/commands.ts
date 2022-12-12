import { Data } from "dataclass";
import { ICommand, ICommandType, MachineState } from "./types";

export class Noop extends Data implements ICommand {
  type = "noop";
  cycleCost = 1;
  apply(s: MachineState) {
    return s;
  }
  static parse(s: string): Noop | null {
    return s.startsWith("noop") ? Noop.create() : null;
  }
}

export class AddX extends Data implements ICommand {
  type = "AddX";
  cycleCost = 2;
  v: number = 0;
  apply(s: MachineState) {
    return { X: s.X + this.v };
  }
  static parse(s: string): AddX | null {
    return s.startsWith("addx")
      ? AddX.create({ v: parseInt(s.split(" ")[1]) })
      : null;
  }
}

export type Commands = Noop | AddX;
export const Commands: ICommandType[] = [Noop, AddX];
