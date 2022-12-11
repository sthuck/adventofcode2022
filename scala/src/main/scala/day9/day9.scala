package info.sthuck
package day9

import info.sthuck.utils.Utils

import scala.annotation.targetName
import scala.collection.mutable.Set

type Coordinates = (Int, Int)
extension (c1: Coordinates) {
  def isTouching(other: Coordinates): Boolean = {
    val (x1, y1) = c1
    val (x2, y2) = other
    Math.max((x1 - x2).abs, (y1 - y2).abs) <= 1
  }
  @targetName("subtract")
  def -(other: Coordinates): Coordinates = {
    val (x1, y1) = c1
    val (x2, y2) = other
    (x1 - x2, y1 - y2)
  }
  def normalized: Coordinates = {
    val (x, y) = c1
    (if x != 0 then x / x.abs else x, if y != 0 then y / y.abs else y)
  }
}

enum Direction:
  case Up, Right, Down, Left

object Direction {
  def apply(c: String): Direction = c match
    case "U" => Up
    case "R" => Right
    case "D" => Down
    case "L" => Left
  end apply
}

class InfiniteBoard {
  var currentPos: Coordinates = (0, 0)

  def move(dir: Direction): Coordinates = {
    dir match {
      case Direction.Up => currentPos = (currentPos._1, currentPos._2 + 1)
      case Direction.Right => currentPos = (currentPos._1 + 1, currentPos._2)
      case Direction.Down => currentPos = (currentPos._1, currentPos._2 - 1)
      case Direction.Left => currentPos = (currentPos._1 - 1, currentPos._2)
    }
    currentPos
  }

  def move(coordinates: Coordinates): Coordinates = {
    currentPos = currentPos + coordinates
    currentPos
  }
}

case class Move(direction: Direction, distance: Int)

class Game(val moves: List[Move], knotNumber: Int = 2) {
  private val knots = (0 until knotNumber map (_ => new InfiniteBoard)).toList

  private def isHeadAndTailTouching(headKnotNumber: Int): Boolean = {
    val head = knots(headKnotNumber)
    val tail = knots(headKnotNumber + 1)
    head.currentPos isTouching tail.currentPos
  }

  private def moveTailInHeadDirection(headKnotNumber: Int): Unit = {
    val head = knots(headKnotNumber)
    val tail = knots(headKnotNumber + 1)
    val diff = head.currentPos - tail.currentPos
    val move = diff.normalized
    tail.move(move)
  }

  def play(): Set[Coordinates] = {
    val tailPositions = Set[Coordinates]()
    for (move <- moves) {
      for (i <- 1 to move.distance) {
        val head = knots.head
        head.move(move.direction)
        for (j <- 0 until knots.length - 1) {
          if (!isHeadAndTailTouching(j)) then {
            moveTailInHeadDirection(j)
          }
        }
        tailPositions += knots.last.currentPos
      }
    }
    tailPositions
  }
}

object Game {
  def parse(input: List[String], knowNumber: Int): Game = {
    val moves = input.map { line =>
      val a = line.split(" ")
      val (dir, dist) = (a(0), a(1))
      Move(Direction(dir), dist.toInt)
    }
    Game(moves, knowNumber)
  }
}

object day9 {
  @main def run(): Unit = {
    val input = Utils.readFromFile("src/main/resources/day9-input")
    val game = Game.parse(input, 2)
    val tailPositions = game.play()
    println(tailPositions.size)
  }

  @main def part2(): Unit = {
    val input = Utils.readFromFile("src/main/resources/day9-input")
    val game = Game.parse(input, 10)
    val tailPositions = game.play()
    println(tailPositions.size)
  }
}
