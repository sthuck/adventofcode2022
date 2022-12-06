package day6


object Datastream {
    fun isAllCharsDifferent(x: CharSequence): Boolean {
        val occurrencesMap = mutableMapOf<Char, Int>()
        for (c in x) {
            occurrencesMap.putIfAbsent(c, 0)
            occurrencesMap[c] = occurrencesMap[c]!! + 1
        }
        return occurrencesMap.values.all{it == 1}
    }

    fun findStartOfStream(stream: String, msgSize: Int): Int? {
        val range = 0 + msgSize until stream.length
        return range.find {i -> isAllCharsDifferent(stream.subSequence(i - msgSize, i))}
    }
}