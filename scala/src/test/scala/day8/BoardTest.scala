package info.sthuck
package day8

import org.specs2.mutable.*

class BoardTest extends Specification {
  "Board Parsing " >> {
    "should parse correctly" >> {
      val input = List("312", "490")
      val board = Board.parse(input)
      board.getVal((1, 1)).get.height must beEqualTo(9)
    }
  }

  "Visibility" >> {
    val s =
      """30373
        |25512
        |65332
        |33549
        |35390""".stripMargin
    "on the edge should be visible" >> {

      val board = Board.parse(s.split("\n").toList)
      board.isVisible(0, 0) must beTrue
      board.isVisible(0, 1) must beTrue
      board.isVisible(2, 4) must beTrue
    }

    "visibility check should work" >> {
      val board = Board.parse(s.split("\n").toList)
      board.isVisible(1, 1) must beTrue
      board.isVisible(3, 1) must beFalse
    }
  }
  "findViewingDistance" >> {
    val s =
      """30373
        |25512
        |65332
        |33549
        |35390""".stripMargin
    "should work" >> {
      val board = Board.parse(s.split("\n").toList)
      board.findViewingDistance(2, 1) must beEqualTo(4)
    }
  }
}
