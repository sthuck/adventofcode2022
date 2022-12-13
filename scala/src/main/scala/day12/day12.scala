package info.sthuck
package day12

import info.sthuck.utils.Utils

import scala.annotation.targetName
import scala.collection.mutable

case class Coord(val x: Int, val y: Int) {
  private var parent: Option[Coord] = None

  def setParent(p: Coord): Coord = {
    parent = Some(p)
    return this
  }

  def getPath: List[Coord] = {
    parent match {
      case Some(p) => p.getPath :+ this
      case None => List(this)
    }
  }

  @targetName("add")
  def +(other: Coord): Coord = Coord(x + other.x, y + other.y)
}


class ElevationGraph(private val map: Seq[Seq[Int]], val start: Coord, val end: Coord) {
  private val rows = map.size
  private val cols = map.head.size
  private val possibleMoves = Seq((0, 1), (0, -1), (1, 0), (-1, 0)).map { case (x, y) => Coord(x, y) }

  private def isValid(coord: Coord): Boolean = coord.x >= 0 && coord.x < cols && coord.y >= 0 && coord.y < rows

  private def getNeighbors(coord: Coord): Seq[Coord] = possibleMoves.map(move => coord + move).filter(isValid)
    .filter(other => {
      val height = map(coord.y)(coord.x)
      val otherHeight = map(other.y)(other.x)
      otherHeight - height <= 1
    })

  // https://en.wikipedia.org/wiki/Breadth-first_search
  def getShortestPath(s: Coord = this.start): Option[List[Coord]] = {
    val queue = mutable.Queue[Coord](s)
    val visited = mutable.Set[Coord](s)
    while queue.nonEmpty do {
      val node = queue.dequeue()
      if node == end then return Some(node.getPath)
      for neighbor <- getNeighbors(node) if !visited.contains(neighbor) do
        queue.enqueue(neighbor)
        neighbor.setParent(node)
        visited.add(neighbor)
    }
    None
  }

  def getShortestPathFromLowElevation: Int = {
    var possibleStarts = map.zipWithIndex.flatMap {
      case (row, y) => row.zipWithIndex.map {
        case (elevation, x) => (Coord(x, y), elevation)
      }
    }
      .filter { case (coord, elevation) => elevation == 1 }.map(_._1)
    val shortest = possibleStarts.map(c => getShortestPath(c).map(_.size - 1).getOrElse(999999999)).min
    shortest
  }
}

object ElevationGraph {
  def parse(input: Seq[String]) = {
    val map = input.map(line => line.map {
      case 'S' => 1
      case 'E' => 26
      case c => c.toInt - 96
    })

    val start = input.zipWithIndex.flatMap {
      case (line, y) => line.zipWithIndex.collectFirst {
        case ('S', x) => Coord(x, y)
      }
    }.head

    val end = input.zipWithIndex.flatMap {
      case (line, y) => line.zipWithIndex.collectFirst {
        case ('E', x) => Coord(x, y)
      }
    }.head
    new ElevationGraph(map, start, end)
  }
}

object day12 {
  @main def part1(): Unit = {
    val input = Utils.readFromFile("src/main/resources/day12-input")
    val graph = ElevationGraph.parse(input)
    val path = graph.getShortestPath()
    println(path.map(_.size - 1).getOrElse(99999999))
    //part2
    val shortest = graph.getShortestPathFromLowElevation
    println(shortest)
  }

}
