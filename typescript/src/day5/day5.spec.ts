import { parseStacks } from "./day5";
describe("day5", () => {
  it("parse columns", () => {
    const input = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3`.split("\n");
    const stacks = parseStacks(input);
    expect(stacks).toMatchSnapshot();
  });
});
