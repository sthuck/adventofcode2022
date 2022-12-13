import { readFileLines, splitLinesByLine } from "../utils";
import { Data } from "dataclass";

type Item = number | ItemList;
type ItemList = Array<Item>;

class ListContainer extends Data {
  left: ItemList = [];
  right: ItemList = [];

  compare() {
    return compareItems(this.left, this.right);
  }
}

const isList = (item: Item): item is ItemList => Array.isArray(item);

export const parseLine = (input: string): ItemList => {
  try {
    return JSON.parse(input);
  } catch (e) {
    console.error("error:", input);
    throw e;
  }
};

export const parseLines = (input: string[]): ListContainer[] => {
  const container = splitLinesByLine(input, "").map(([first, second]) => {
    const left = parseLine(first);
    const right = parseLine(second);
    return ListContainer.create({ left, right });
  });
  return container;
};

export enum CompareResult {
  Ordered,
  Equal,
  Unordered,
}

const compareIntItems = (left: number, right: number): CompareResult => {
  if (left === right) {
    return CompareResult.Equal;
  }
  if (left < right) {
    return CompareResult.Ordered;
  }
  return CompareResult.Unordered;
};
const isUndefined = (item: any): item is undefined => item === undefined;

export const compareListItems = (
  left: ItemList,
  right: ItemList
): CompareResult => {
  for (let i = 0; i < right.length; i++) {
    const leftItem = left[i];
    const rightItem = right[i];
    if (isUndefined(leftItem)) {
      return CompareResult.Ordered;
    }
    const result = compareItems(leftItem, rightItem);
    if (result !== CompareResult.Equal) {
      return result;
    }
  }
  if (left.length > right.length) {
    return CompareResult.Unordered;
  }
  return CompareResult.Equal;
};

const toList = (item: Item): ItemList => {
  if (isList(item)) {
    return item;
  }
  return [item];
};

export const compareItems = (left: Item, right: Item): CompareResult => {
  if (!isList(left) && !isList(right)) {
    return compareIntItems(left, right);
  } else {
    return compareListItems(toList(left), toList(right));
  }
};
