import { range } from "lodash";
import { MachinePlugin, MachineState } from "./types";
const ROWS = 6;
const COLS = 40;

const sleep = (milliseconds: number | undefined) =>
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);

export class CRT implements MachinePlugin {
  private memory = range(ROWS).map(() => range(COLS).map(() => " "));
  private currentCycle = 1;
  private slowMode = false;

  withSlowMode() {
    this.slowMode = true;
    return this;
  }

  private isPixelOn(s: MachineState, col: number) {
    return Math.abs(s.X - col) <= 1;
  }

  private printToScreen() {
    const index = this.currentCycle - 1;
    const row = Math.floor(index / COLS);
    const col = index % COLS;
    process.stdout.write(this.memory[row][col]);
    if (col === COLS - 1) {
      process.stdout.write("\n");
    }

    // console.log("\x1Bc");
    // console.log(this.memory.map((row) => row.join("")).join("\n"));
  }

  runCycle(s: MachineState) {
    const index = this.currentCycle - 1;
    const row = Math.floor(index / COLS);
    const col = index % COLS;
    if (this.isPixelOn(s, col)) {
      this.memory[row][col] = "#";
    }
    this.printToScreen();
    this.currentCycle++;
    if (this.slowMode) {
      sleep(30);
    }
  }
}
