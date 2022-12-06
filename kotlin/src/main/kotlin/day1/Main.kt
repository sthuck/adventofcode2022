package day1

import  java.nio.file.Files
import java.nio.file.Path


fun main(args: Array<String>) {
    val p = Path.of(ClassLoader.getSystemResource("input").toURI())
    val lines = Files.readAllLines(p)
    val elves = Parser.parse(lines)
    val max = elves.maxOfOrNull { it.total() } //implicit lambda, anonymous function
    println(max)
    //Part 2
    val elvesSorted = elves.sortedBy(Elf::total).reversed() // function refrence
    val top3 = elvesSorted.subList(0, 3)
    println(top3.sumOf {elf -> elf.total()}) //lambda
}