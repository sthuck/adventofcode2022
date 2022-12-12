package info.sthuck
package day11
import scala.collection.mutable.Stack
import utils.Utils

import scala.collection.mutable

case class Move(
  item: BigInt,
  moveTo: Int
               )
case class Monkey(val id: Int,
                  var items: mutable.Stack[BigInt],
                  val operation: (BigInt) => BigInt,
                  val testDivisibleBy: BigInt,
                  val targetTrue: Int,
                  val targetFalse: Int) {
private var inspectedItems = 0

  def inspectItems(): List[Move] = {
//    println("Monkey"+this.id)
    var moves = List[Move]()
    while (items.nonEmpty) {
      val item = items.pop
//      println(s"\tMonkey inspects an item with a worry level of ${item}.")
      this.inspectedItems+=1
      val newWorry = this.operation(item)
//      println(s"\t\tWorry level is multiplied by x to ${newWorry}.")
//      val newWorryBoredom = Math.round(newWorry/3)
      val newWorryBoredom = newWorry
//      println(s"\t\tMonkey gets bored with item. Worry level is divided by 3 to ${newWorryBoredom}")
      val isDivisble = newWorryBoredom % this.testDivisibleBy == 0
//      println(s"\t\tCurrent worry level is ${if isDivisble then "" else "not"} divisible by ${this.testDivisibleBy}")
      val target = if isDivisble then targetTrue else targetFalse
//      println(s"\t\tItem with worry level ${item} is thrown to monkey ${target}.")
      moves = moves :+ Move(newWorryBoredom, target)
    }
    moves
  }
  def removeItem(item: BigInt) = this.items = this.items.filter(_ == item)
  def addItem(item: BigInt) = this.items = this.items :+ item

  def getTotalInspected = inspectedItems
}

object Monkey {
  def parse(input: List[String]): Monkey = {
    /*
    Monkey 0:
      Starting items: 56, 56, 92, 65, 71, 61, 79
      Operation: new = old * 7
      Test: divisible by 3
        If true: throw to monkey 3
        If false: throw to monkey 7
    */
    val id = "Monkey (\\d):".r.findFirstMatchIn(input.head).get.group(1).toInt
    val items = input(1).split(": ")(1).split(", ").map(_.toInt).toSeq
    val itemsStack = mutable.Stack[BigInt]()
    itemsStack.pushAll(items.map(BigInt(_)))
    val operationMatches = "Operation: new = old ([*+]) (\\d+|old)".r.findFirstMatchIn(input(2)).get
    val operand2 = operationMatches.group(2)
    val operation = operationMatches.group(1) match {
      case "*" => (x: BigInt) => x * (if (operand2 == "old") then x else operand2.toInt)
      case "+" => (x: BigInt) => x + (if (operand2 == "old") then x else operand2.toInt)
    }
    val testDivisibleBy = "Test: divisible by (\\d+)".r.findFirstMatchIn(input(3)).get.group(1).toInt
    val targetTrue = "If true: throw to monkey (\\d+)".r.findFirstMatchIn(input(4)).get.group(1).toInt
    val targetFalse = "If false: throw to monkey (\\d+)".r.findFirstMatchIn(input(5)).get.group(1).toInt

    Monkey(id, itemsStack, operation, testDivisibleBy, targetTrue, targetFalse)
  }
}

class Manager(private val monkeys: List[Monkey]) {
  private def applyMove(originalMonkey: Monkey, move: Move): Unit = {
    originalMonkey.removeItem(move.item)
    this.monkeys.find(_.id == move.moveTo).get.addItem(move.item)
  }
  def doRound(): Unit = {
    for (monkey <- monkeys) {
      val moves = monkey.inspectItems()
      moves.foreach(move => this.applyMove(monkey, move))
    }
  }

  def monkeyBuisness() = {
    monkeys.map(_.getTotalInspected).sorted.takeRight(2)
  }
}

object day10 {
  @main def part1(): Unit = {
    val input = Utils.readFromFile("src/main/resources/day11-input")
    val chunks = Utils.sliceLinesToChunks(input, _ == "")
    val monkeys = chunks.map(Monkey.parse)
    val manager = Manager(monkeys)

    for (i <- 0 until 10000) {
      println(i)
      manager.doRound()
    }

    println(manager.monkeyBuisness())
  }
  //  val input = parseInput(inputString)
  //  val result = solve(input)
  //  println(result)
}
