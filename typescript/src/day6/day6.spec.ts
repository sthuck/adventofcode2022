import { Parser } from "./day6";
describe("day6", () => {
  it("", () => {
    const input = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;
    const parser = new Parser();
    parser.parse(input.split("\n"));
    console.log(parser.tree.children.map((c) => c.name));
  });
});
