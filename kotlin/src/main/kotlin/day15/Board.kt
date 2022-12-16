package day15

import kotlin.math.abs
import kotlin.math.log
import kotlin.math.sign

typealias Coord = Pair<Int, Int>
typealias Line = Sequence<Coord>

data class Sensor(val position: Coord, val beacon: Beacon) {
    val radius = distance(beacon.position, position)

    fun inRangeOf(coord: Coord): Boolean {
        return distance(coord, this.position) <= radius
    }

    fun createLinesAroundSensor(): List<Line> {
        val lines = mutableListOf<Line>()
        val x = position.first
        val y = position.second
        val r = radius
        lines.add(createLine(Pair(x, y - r - 1), Pair(x + r + 1, y))) //top to right
        lines.add(createLine(Pair(x + r + 1, y), Pair(x, y + r + 1))) // right to down
        lines.add(createLine(Pair(x, y + r + 1), Pair(x - r - 1, y))) // down to left
        lines.add(createLine(Pair(x - r - 1, y), Pair(x, y - r - 1))) // left to top

        return lines
    }
}

data class Beacon(val position: Coord)

fun createLine(origin: Coord, to: Coord): Sequence<Coord> {
    return sequence<Coord> {
        val (x1, y1) = origin
        val (x2, y2) = to
        assert(abs(x1 - x2) == abs(y1 - y2))
        val xDirection = (x2 - x1).sign
        val yDirection = (y2 - y1).sign
        var x = x1
        var y = y1
        while (x != x2 || y != y2) {
            yield(Pair(x, y))
            x += xDirection
            y += yDirection
        }
        yield(Pair(x, y))
    }
}

fun distance(origin: Coord, other: Coord): Int {
    // Manhattan distance
    val (x, y) = origin
    val (x2, y2) = other
    return abs(x - x2) + abs(y - y2)
}

class Board(val sensors: List<Sensor>) {
    var minX = sensors.flatMap { listOf(it.position.first, it.beacon.position.first) }.min()
    var maxX = sensors.flatMap { listOf(it.position.first, it.beacon.position.first) }.max()
    var minY = sensors.flatMap { listOf(it.position.second, it.beacon.position.second) }.min()
    var maxY = sensors.flatMap { listOf(it.position.second, it.beacon.position.second) }.max()
    val maxRadius = sensors.map { it.radius }.max()

    fun setLimits(maxX: Int, minX: Int, maxY: Int, minY: Int) {
        this.maxX = maxX
        this.minX = minX
        this.maxY = maxY
        this.minY = minY
    }

    fun findPossibleOpenBeaconsPos(): Coord {
        sensors.forEach { s ->
            val linesToCheck = s.createLinesAroundSensor()
            linesToCheck.forEach { line ->
                val point = line.find { c ->
                    ((!sensors.any { s -> s.inRangeOf(c) })
                            && c.first <= maxX && c.first >= minX && c.second <= maxY && c.second >= minY
                            )
                }

                if (point != null) {
                    return@findPossibleOpenBeaconsPos point
                }
            }
        }
        throw Exception("No point found")
    }

    fun howManyNotAllowedInRow(row: Int): Int {
        val found = ((minX - maxRadius)..(maxX + maxRadius))
            .filter { x -> this.sensors.any { it.inRangeOf(Pair(x, row)) && it.beacon.position != Pair(x, row) } }
        return found.size
    }

    companion object Parser {
        fun parse(lines: List<String>): Board {
            // Sensor at x=480296, y=3999646: closest beacon is at x=1694700, y=4178942
            val re = Regex("Sensor at x=(-?\\d+), y=(-?\\d+): closest beacon is at x=(-?\\d+), y=(-?\\d+)")
            val sensors = lines.map { line ->
                val m = re.matchEntire(line)
                if (m != null) {
                    val (sx, sy, bx, by) = listOf(
                        m.groups[1],
                        m.groups[2],
                        m.groups[3],
                        m.groups[4]
                    ).map { it!!.value.toInt() }
                    val b = Beacon(Pair(bx, by))
                    return@map Sensor(Pair(sx, sy), b)
                } else {
                    throw IllegalArgumentException("Invalid line: $line")
                }
            }
            return Board(sensors)
        }
    }
}