import { readFileLines, reducers } from "../utils";
import { Parser, Dir } from "./day6";

const main = () => {
  const lines = readFileLines("src/day6/input.txt");
  const parser = new Parser();
  const tree = parser.parse(lines);
  const itemsBelowSize100000: Dir[] = [];
  tree.traverse((item) => {
    if (item.isDir() && item.getSize() < 100000) {
      itemsBelowSize100000.push(item);
    }
  });
  console.log(
    itemsBelowSize100000.map((i) => i.getSize()).reduce(reducers.sumNum, 0)
  );

  //part2
  const fullSpace = 70000000;
  const currentlyUsed = tree.getSize();
  const freeSpace = fullSpace - currentlyUsed;
  const neededSpace = 30000000;
  const needToDeleteSpace = neededSpace - freeSpace;

  const itemsAboveNeededSpace: Dir[] = [];
  tree.traverse((item) => {
    if (item.isDir() && item.getSize() >= needToDeleteSpace) {
      itemsAboveNeededSpace.push(item);
    }
  });
  const sorted = itemsAboveNeededSpace.sort(
    (a, b) => b.getSize() - a.getSize()
  );
  const smallestDir = sorted[sorted.length - 1];
  console.log(smallestDir.getSize());
};
main();
