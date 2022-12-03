import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class ParserTest {
    @Test
    fun parse() {
        val result = Parser.parse(listOf("8000","2000","", "2000", "3000"))
        assertEquals(listOf(Elf(listOf(8000,2000)), Elf(listOf(2000, 3000))), result)
    }

}