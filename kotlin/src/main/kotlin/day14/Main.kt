package day14

import java.nio.file.Files
import java.nio.file.Path

fun main(args: Array<String>) {
    val p = Path.of(ClassLoader.getSystemResource("input-day6").toURI())
    val lines = Files.readAllLines(p)
    println("Step1:" + Datastream.findStartOfStream(lines[0],4))
    println("Step2:" + Datastream.findStartOfStream(lines[0],14))

}
