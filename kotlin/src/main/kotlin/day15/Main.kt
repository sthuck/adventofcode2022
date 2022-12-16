package day15

import java.nio.file.Files
import java.nio.file.Path

fun part1() {
    val p = Path.of(ClassLoader.getSystemResource("input-day15").toURI())
    val lines = Files.readAllLines(p)
    val b = Board.parse(lines)
    val result = b.howManyNotAllowedInRow(2000000)
    println("result $result")
}

fun part2() {
    val p = Path.of(ClassLoader.getSystemResource("input-day15").toURI())
    val lines = Files.readAllLines(p)
    val b = Board.parse(lines)
//    b.sensors.forEach { println("${it.position}, ${it.radius}") }
    b.setLimits(4000000, 0, 4000000, 0)
    val c = b.findPossibleOpenBeaconsPos()
    println("result $c")
}

fun main(args: Array<String>) {
    part2()
}

