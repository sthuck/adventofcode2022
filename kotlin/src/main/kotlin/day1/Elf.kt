package day1

import kotlin.collections.sum
data class Elf(val calories: List<Int>) {
    public fun total(): Int {
        return this.calories.sum()
    }
}
