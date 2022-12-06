package day6

import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

class DatastreamTest {
    @Test
    fun isAllDifferent() {
        assert(Datastream.isAllCharsDifferent("abcd"))
        assert(!Datastream.isAllCharsDifferent("abca"))
    }
    @Test
    fun findStartOfStream() {
        assert(Datastream.findStartOfStream("bvwbjplbgvbhsrlpgdmjqwftvncz", 4) == 5)
        assert(Datastream.findStartOfStream("nppdvjthqldpwncqszvftbrmjlhg", 4) == 6)
        assert(Datastream.findStartOfStream("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 4) == 10)
        assert(Datastream.findStartOfStream("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 4) == 11)
        assertEquals(Datastream.findStartOfStream("mjqjpqmgbljsphdztnvjfqwrcgsmlb", 14), 19)
        assertEquals(Datastream.findStartOfStream("bvwbjplbgvbhsrlpgdmjqwftvncz", 14) ,23)
        assertEquals(Datastream.findStartOfStream("nppdvjthqldpwncqszvftbrmjlhg", 14), 23)
    }
}