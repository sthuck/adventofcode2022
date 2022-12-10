package info.sthuck
package utils

import scala.io.Source

object Utils {
  def readFromFile(path: String): List[String] = {
    val source = Source.fromFile(path)
    val lines = source.getLines().toList
    source.close()
    lines
  }
}
