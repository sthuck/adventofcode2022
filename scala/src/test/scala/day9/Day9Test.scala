package info.sthuck
package day9
import org.specs2.mutable.*

class Day9Test extends Specification {
   "day9" >> {
     val s: String = """R 4
         |U 4
         |L 3
         |D 1
         |R 4
         |D 1
         |L 5
         |R 2""".stripMargin
     "should follow head" >> {
       val game = Game.parse(s.split("\n").toList, 2)
       val positions = game.play()
       positions.size must beEqualTo(13)
     }
   }
}
