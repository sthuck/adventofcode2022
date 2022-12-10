package info.sthuck
package day8

import utils.Utils

case class Tile(height: Int)
class Board(private val board:List[List[Tile]] = List()) {
  private val xSize = board.head.size
  private val ySize = board.size
  def getVal(coordinates: (Int, Int)): Option[Tile] = this.board.lift(coordinates._2).flatMap(_.lift(coordinates._1))

  private def getAllByDirection(coordinates: (Int, Int), direction: Direction): List[Tile] = {
    val nextCoordinates = applyDirection(direction, coordinates)
    getVal(nextCoordinates) match {
      case Some(tile) => tile :: getAllByDirection(nextCoordinates, direction)
      case None => List()
    }
  }
  def isVisible(coordinates: (Int, Int)): Boolean = {
    val tile = getVal(coordinates)
    tile match {
      case Some(tile) => Direction.values.exists(getAllByDirection(coordinates, _).forall(_.height < tile.height))
      case None => false
    }
  }
  def allCoordinates: IndexedSeq[(Int, Int)] = for {
    x <- 0 until xSize
    y <- 0 until ySize
  } yield (x, y)

  def findViewingDistance(cooridnates: (Int, Int)): Int = {
    val tile = getVal(cooridnates).getOrElse(throw new IllegalArgumentException("No tile at coordinates"))
    val distances =for {
      d <- Direction.values
    } yield {
      val neighborsByDirection = getAllByDirection(cooridnates, d)
      val visibleNeighbors = neighborsByDirection.takeWhile(_.height < tile.height)
      val distance = if (visibleNeighbors.size == neighborsByDirection.size) visibleNeighbors.size else visibleNeighbors.size + 1
      distance
    }
    distances.product
  }
}

object Board {
  def parse(input: List[String]): Board = {
    val board = input.map(_.map(c => Tile(c.toString.toInt)).toList)
    Board(board)
  }
}
def applyDirection(direction: Direction, coordinate: (Int, Int)): (Int, Int) = direction match
  case Direction.Up => (coordinate._1, coordinate._2 - 1)
  case Direction.Down => (coordinate._1, coordinate._2 + 1)
  case Direction.Left => (coordinate._1 - 1, coordinate._2)
  case Direction.Right => (coordinate._1 + 1, coordinate._2)
enum Direction:
  case Up,Right,Down,Left

object day8 {
  @main def part1(): Unit = {
    val input = Utils.readFromFile("src/main/resources/day8-input")
    val board = Board.parse(input)
    val visible = board.allCoordinates.count(board.isVisible)
    println(visible)
  }

  @main def part2(): Unit = {
    val input = Utils.readFromFile("src/main/resources/day8-input")
    val board = Board.parse(input)
    val distances = board.allCoordinates.map(board.findViewingDistance)
    println(distances.max)
  }
}
