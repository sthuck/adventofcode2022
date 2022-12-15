import { reducers, sleep } from "../utils";
import { range } from "lodash";
enum Tile {
  Empty = 0,
  Wall = 1,
  Sand = 2,
}
const TileToChar: Record<Tile, string> = {
  [Tile.Empty]: " ",
  [Tile.Wall]: "#",
  [Tile.Sand]: "o",
};

type Coord = [number, number];

const moveCoord = (coord: Coord) => ({
  down: () => [coord[0], coord[1] + 1] as Coord,
  downLeft: () => [coord[0] - 1, coord[1] + 1] as Coord,
  downRight: () => [coord[0] + 1, coord[1] + 1] as Coord,
});

type WallInstruction = Array<Coord>;

export const parser = (lines: string[]): Board => {
  const LineInstructions: WallInstruction[] = lines.map((line) =>
    line.split(" -> ").map((s) => s.split(",").map(Number) as [number, number])
  );
  const width =
    LineInstructions.flatMap((li) => li.map(([x]) => x)).reduce((a, b) =>
      Math.max(a, b)
    ) + 1000;
  const height =
    LineInstructions.flatMap((li) => li.map(([_, y]) => y)).reduce((a, b) =>
      Math.max(a, b)
    ) + 2;
  const board = new Board(width, height);
  LineInstructions.forEach((li) => board.addWall(li));
  return board;
};

export class Board {
  private tiles: Tile[][];
  private width: number;
  private height: number;
  private sandPoint: Coord = [500, 0];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.tiles = new Array(height).fill(0).map(() => new Array(width).fill(0));
  }

  public getTile(c: Coord): Tile {
    const [x, y] = c;
    return this.tiles[y][x];
  }
  public setTile(c: Coord, tile: Tile) {
    const [x, y] = c;
    this.tiles[y][x] = tile;
  }

  private moveSand(from: Coord, to: Coord) {
    this.setTile(from, Tile.Empty);
    this.setTile(to, Tile.Sand);
  }

  private canMoveTo(coord: Coord): boolean {
    const [x, y] = coord;
    if (y >= this.height || x < 0 || x >= this.width) {
      return false;
    }
    return this.getTile(coord) === Tile.Empty;
  }

  private flowSandDown(print = false) {
    let current = this.sandPoint;
    this.setTile(current, Tile.Sand);

    while (true) {
      if (print) {
        sleep(10);
        //clear screen
        console.log("\x1Bc");
        // console.log("\n\n");
        this.print();
      }
      const possibleMove = [
        moveCoord(current).down(),
        moveCoord(current).downLeft(),
        moveCoord(current).downRight(),
      ].find((c) => this.canMoveTo(c));
      if (possibleMove) {
        this.moveSand(current, possibleMove);
        current = possibleMove;
      } else {
        break;
      }
    }
  }
  public runSim(stopOn: "bottom" | "top", print = false) {
    let i = 0;
    const stopFn =
      stopOn === "bottom"
        ? this.reachedBottom.bind(this)
        : this.reachedTop.bind(this);
    while (!stopFn()) {
      this.flowSandDown(print);
      i++;
    }
    const total = this.tiles
      .flatMap((l) => l.map((t) => (t === Tile.Sand ? (1 as number) : 0)))
      .reduce(reducers.sumNum);
    return i;
  }

  private reachedBottom() {
    const lastLine = this.tiles[this.tiles.length - 1];
    return lastLine.some((t) => t === Tile.Sand);
  }

  private reachedTop() {
    return this.getTile(this.sandPoint) === Tile.Sand;
  }

  private addPartOfWall(coords: [Coord, Coord]) {
    const [start, end] = coords;
    const [x1, y1] = start;
    const [x2, y2] = end;
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (dx && dy) {
      throw new Error("Diagonal lines are not supported");
    }
    if (dx) {
      const [startX, endX] = [Math.min(x1, x2), Math.max(x1, x2)];
      const howMuch = Math.abs(dx);
      range(howMuch + 1).forEach((i) =>
        this.setTile([startX + i, y1], Tile.Wall)
      );
    }
    if (dy) {
      const [startY, endY] = [Math.min(y1, y2), Math.max(y1, y2)];
      const howMuch = Math.abs(dy);
      range(howMuch + 1).forEach((i) =>
        this.setTile([x1, startY + i], Tile.Wall)
      );
    }
  }

  public addWall(wall: WallInstruction) {
    for (let i = 0; i < wall.length - 1; i++) {
      this.addPartOfWall([wall[i], wall[i + 1]]);
    }
  }

  public print() {
    const tiles = this.tiles;
    const minWidth =
      Math.min(
        ...this.tiles
          .map((l) => l.findIndex((t) => t === Tile.Wall || t === Tile.Sand))
          .filter((i) => i !== -1)
      ) - 1;

    tiles.forEach((line) => {
      console.log(
        line
          .slice(minWidth)
          .map((t) => TileToChar[t])
          .join("")
      );
    });
  }
}
