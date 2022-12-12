import { untilFirst } from "../utils";
import { AddX, Commands } from "./commands";
import { ICommand, MachineState, MachinePlugin } from "./types";
import { range } from "lodash";
export class Machine {
  constructor(private readonly commands: ICommand[]) {}
  private cycle: number = 1;
  private commandIndex = 0;
  private commandCycleCounter = 0;
  private state: MachineState = { X: 1 };
  private plugins: MachinePlugin[] = [];

  addPlugin(p: MachinePlugin) {
    this.plugins.push(p);
    return this;
  }

  /* returns state at end of cycle */
  runCycle() {
    this.plugins.forEach((p) => p.runCycle(this.state));
    this.commandCycleCounter++;
    const currentCommand = this.commands[this.commandIndex];
    if (this.commandCycleCounter >= currentCommand.cycleCost) {
      this.commandIndex++;
      this.commandCycleCounter = 0;
      this.state = currentCommand.apply(this.state);
    }
    this.cycle++;
    return this.state;
  }

  runCycles(
    cycles: number,
    cycleCollectedStates: Record<number, MachineState> = {}
  ) {
    return range(cycles).reduce((states) => {
      const cycle = this.cycle;
      states[cycle] = this.state;
      this.runCycle();
      return states;
    }, cycleCollectedStates);
  }

  static parse(lines: string[]) {
    const commands = lines.map((line) =>
      untilFirst(Commands, (c) => c.parse(line))
    );
    return new Machine(commands);
  }
}
