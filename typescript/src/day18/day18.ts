import { range, isEqual } from "lodash";
type Coord = [number, number, number];
const parseInput = (input: string[]): Coord[] => {
  return input.map((line) => {
    const [x, y, z] = line.split(",");
    return [Number(x), Number(y), Number(z)];
  });
};

const axis01Connected = (a: Coord, b: Coord): boolean =>
  a[0] === b[0] && a[1] === b[1] && Math.abs(a[2] - b[2]) === 1;
const axis02Connected = (a: Coord, b: Coord): boolean =>
  a[0] === b[0] && a[2] === b[2] && Math.abs(a[1] - b[1]) === 1;
const axis12Connected = (a: Coord, b: Coord): boolean =>
  a[1] === b[1] && a[2] === b[2] && Math.abs(a[0] - b[0]) === 1;

const findConnectedCubes = (cubeCoords: Coord[], cube: Coord): Coord[] => {
  return cubeCoords.filter((otherCube) => {
    return [axis01Connected, axis02Connected, axis12Connected].some((axis) =>
      axis(cube, otherCube)
    );
  });
};

const computeExposedSidesOfCube = (
  cubeCoords: Coord[],
  cube: Coord
): number => {
  const connectedCubes = findConnectedCubes(cubeCoords, cube);
  // console.log(
  //   `for cube ${cube} connected cubes are ${connectedCubes
  //     .map((c) => c.join(","))
  //     .join(" ")}`
  // );
  return 6 - connectedCubes.length;
};

export const part1 = (input: string[]): number => {
  const cubeCoords = parseInput(input);
  return cubeCoords.reduce(
    (acc, cube) => acc + computeExposedSidesOfCube(cubeCoords, cube),
    0
  );
};

const coordToString = (c: Coord): string => c.join(",");
export const part2 = (input: string[]): number => {
  const lavaCoords = parseInput(input);
  const maxAxis0 = lavaCoords.reduce((acc, cube) => Math.max(acc, cube[0]), 0);
  const maxAxis1 = lavaCoords.reduce((acc, cube) => Math.max(acc, cube[1]), 0);
  const maxAxis2 = lavaCoords.reduce((acc, cube) => Math.max(acc, cube[2]), 0);
  const allPossibleCubes = range(maxAxis0 + 1).flatMap((x) =>
    range(maxAxis1 + 1).flatMap((y) =>
      range(maxAxis2 + 1).map((z) => [x, y, z] as Coord)
    )
  );
  enum Fill {
    Empty = 0,
    Steam = 1,
    Lava = 2,
  }
  const allPossibleCubesMap = new Map();
  allPossibleCubes.forEach((c) =>
    allPossibleCubesMap.set(coordToString(c), Fill.Empty)
  );
  lavaCoords.forEach((c) =>
    allPossibleCubesMap.set(coordToString(c), Fill.Lava)
  );
  const strToCoord = (s: string): Coord =>
    s.split(",").map((n) => Number(n)) as Coord;
  const start = [0, 0, 0] as Coord;
  const isOutOfBounds = isOutOfBoundsFn(maxAxis0, maxAxis1, maxAxis2);
  //FloodFill
  const queue = [coordToString(start)];
  const visited = new Set();
  while (queue.length > 0) {
    const coordStr = queue.shift()!;
    if (visited.has(coordStr)) {
      continue;
    }
    const current = strToCoord(coordStr) as Coord;

    visited.add(coordStr);
    if (allPossibleCubesMap.get(coordToString(current)) === Fill.Lava) {
      continue;
    }
    allPossibleCubesMap.set(coordStr, Fill.Steam);

    const neighbors = CoordGetNeighbors(current).filter(
      (n) =>
        !visited.has(n) &&
        allPossibleCubesMap.get(coordToString(n)) === Fill.Empty &&
        !isOutOfBounds(n)
    );
    queue.push(...neighbors.map(coordToString));
  }
  //End Fill
  const allEmptyCubes = allPossibleCubes.filter(
    (cube) => allPossibleCubesMap.get(coordToString(cube)) === Fill.Empty
  );
  const forPart2 = parseInput(input).concat(allEmptyCubes);
  return forPart2.reduce(
    (acc, cube) => acc + computeExposedSidesOfCube(forPart2, cube),
    0
  );
};
const isOutOfBoundsFn =
  (maxAxis0: number, maxAxis1: number, maxAxis2: number) =>
  (c: Coord): boolean => {
    const [x, y, z] = c;
    return (
      x < 0 || y < 0 || z < 0 || x > maxAxis0 || y > maxAxis1 || z > maxAxis2
    );
  };
const CoordGetNeighbors = (c: Coord): Coord[] => {
  const [x, y, z] = c;
  return [
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y + 1, z],
    [x, y - 1, z],
    [x, y, z + 1],
    [x, y, z - 1],
  ];
};
