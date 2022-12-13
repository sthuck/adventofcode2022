package info.sthuck
package day11
import scala.collection.mutable.Stack
import utils.Utils

import scala.collection.mutable

class Item(base: Int) {
  val map: mutable.Map[Int, Int] = mutable.Map[Int, Int]()
  for (n <- Item.divisibleByChecks) {
    map(n) = base % n
  }
  def this(map: mutable.Map[Int, Int]) = {
    this(0)
    this.map ++= map
  }

  def isDivisibleBy(n: Int): Boolean = {
    if (!map.contains(n)) {
      throw new Exception(s"key ${n} not found")
    }
    map(n) == 0
  }

  def +(i: Int) = {
    val newMap = mutable.Map[Int, Int]()
    for (n <- Item.divisibleByChecks) {
      newMap(n) = (this.map(n) + i) % n
    }
    Item(newMap)
  }

  def square() = {
    val newMap = mutable.Map[Int, Int]()
    for (n <- Item.divisibleByChecks) {
      newMap(n) = (this.map(n) * this.map(n)) % n
    }
    Item(newMap)
  }

  def *(i: Int) = {
    val newMap = mutable.Map[Int, Int]()
    for (n <- Item.divisibleByChecks) {
      newMap(n) = (this.map(n) * i) % n
    }
    Item(newMap)
  }
}

object Item {
  private var divisibleByChecks: mutable.Seq[Int] = mutable.ArraySeq[Int]()
  def registerDivisibleBy(n: Int): Unit = {
    divisibleByChecks = divisibleByChecks.appended(n)
  }
}


case class Move(
  item: Item,
  moveTo: Int
               )
case class Monkey(val id: Int,
                  var items: mutable.Stack[Item],
                  val operation: (Item) => Item,
                  val testDivisibleBy: Int,
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
      val isDivisble = newWorryBoredom.isDivisibleBy(this.testDivisibleBy)
//      println(s"\t\tCurrent worry level is ${if isDivisble then "" else "not"} divisible by ${this.testDivisibleBy}")
      val target = if isDivisble then targetTrue else targetFalse
//      println(s"\t\tItem with worry level ${item} is thrown to monkey ${target}.")
      moves = moves :+ Move(newWorryBoredom, target)
    }
    moves
  }
  def removeItem(item: Item): Unit = this.items = this.items.filter(_ == item)
  def addItem(item: Item): Unit = this.items = this.items :+ item

  def getTotalInspected: Int = inspectedItems
}

object Monkey {
  def parse(input: List[String]): Monkey = {

    val id = "Monkey (\\d):".r.findFirstMatchIn(input.head).get.group(1).toInt
    val items = input(1).split(": ")(1).split(", ").map(_.toInt).toSeq

    val operationMatches = "Operation: new = old ([*+]) (\\d+|old)".r.findFirstMatchIn(input(2)).get
    val operand2 = operationMatches.group(2)
    val operation = operationMatches.group(1) match {
      case "*" => (x: Item) =>  if (operand2 == "old") then {
        x.square()
      } else x * operand2.toInt
      case "+" => (x: Item) => if (operand2 == "old") then {
        throw new Exception("not implemented")
      } else x + operand2.toInt
    }
    val testDivisibleBy = "Test: divisible by (\\d+)".r.findFirstMatchIn(input(3)).get.group(1).toInt
    val targetTrue = "If true: throw to monkey (\\d+)".r.findFirstMatchIn(input(4)).get.group(1).toInt
    val targetFalse = "If false: throw to monkey (\\d+)".r.findFirstMatchIn(input(5)).get.group(1).toInt
    val itemsStack = mutable.Stack[Item]()
    itemsStack.pushAll(items.map(Item(_)))
    Monkey(id, itemsStack, operation, testDivisibleBy, targetTrue, targetFalse)
  }
}

class Manager(private val monkeys: List[Monkey]) {
  private def applyMove(originalMonkey: Monkey, move: Move): Unit = {
//    originalMonkey.removeItem(move.item)
    this.monkeys.find(_.id == move.moveTo).get.addItem(move.item)
  }
  def doRound(): Unit = {
    for (monkey <- monkeys) {
      val moves = monkey.inspectItems()
      moves.foreach(move => this.applyMove(monkey, move))
    }
  }

  def monkeyBuisness() = {
    monkeys.map(_.getTotalInspected).sorted.takeRight(2).map(_.toLong).product
  }
}

object day11 {
  //part 1 got lost in the refactoring for part2, because "Item" class is one giant hack
  @main def part2(): Unit = {
    val input = Utils.readFromFile("src/main/resources/day11-input")
    val chunks = Utils.sliceLinesToChunks(input, _ == "")
    chunks.foreach(chunk => {
      val testDivisibleBy = "Test: divisible by (\\d+)".r.findFirstMatchIn(chunk(3)).get.group(1).toInt
      Item.registerDivisibleBy(testDivisibleBy)
    })
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
