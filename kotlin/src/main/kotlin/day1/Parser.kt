package day1

import java.lang.Integer.parseInt

object Parser {

    fun parse(x: List<String>): List<Elf> {

        val listOfStringLists = x.fold(listOf(mutableListOf<String>())) { acc, s ->
            if (s == "") {
                return@fold listOf(*acc.toTypedArray(), mutableListOf<String>())
            } else {
                acc.last().add(s)
            }
            acc
        }
        return listOfStringLists.map {
            Elf(it.map(::parseInt))
        }
    }
}