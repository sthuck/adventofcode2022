export interface ICommand {
  cycleCost: number;
  apply(machine: MachineState): MachineState;
}

export interface ICommandType {
  parse(s: string): ICommand | null;
}

export interface MachineState {
  X: number;
}

export interface MachinePlugin {
  runCycle(s: MachineState): void;
}
