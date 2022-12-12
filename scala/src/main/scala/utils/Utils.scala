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
  def sliceLinesToChunks[A](lines: List[A], splitPredicate: (A) => Boolean): List[List[A]] = {
    val (chunks, finalChunk) = lines.foldLeft((List[List[A]](), List[A]())) {
      case ((chunks, chunk), line) =>
        if (splitPredicate(line)) {
          (chunk :: chunks, List[A]())
        } else {
          (chunks,  chunk :+ line)
        }
    }
    (finalChunk :: chunks).reverse
  }
}
