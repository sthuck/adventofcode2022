import {
  compareItems,
  compareListItems,
  CompareResult,
  parseLines,
} from "./day13";
const demoData = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

describe("a", () => {
  it("a", () => {
    const data = parseLines(demoData.split("\n"));
    expect(data.length).toBe(8);
    expect(data[0].compare()).toBe(CompareResult.Ordered);
    expect(data[1].compare()).toBe(CompareResult.Ordered);
    expect(data[2].compare()).toBe(CompareResult.Unordered);
    expect(data[3].compare()).toBe(CompareResult.Ordered);
    expect(data[4].compare()).toBe(CompareResult.Unordered);
    expect(data[5].compare()).toBe(CompareResult.Ordered);
    expect(data[6].compare()).toBe(CompareResult.Unordered);
    expect(data[7].compare()).toBe(CompareResult.Unordered);
  });
});
