public class BestPractice{
    public static void main(String[] args) {
        String string1 = "hello";
        String string2 = "hi";
        
        String longer = StringUtils.betterString(string1, string2, (s1, s2) -> s1.length() > s2.length() );
        System.out.println("Longer string: " + longer);
        
        String first = StringUtils.betterString( string1, string2, (s1, s2) -> true);
        System.out.println("First string: " + first);
        
        String alphabetical = StringUtils.betterString(string1, string2,(s1, s2) -> s1.compareTo(s2) < 0);
        System.out.println("Alphabetically first: " + alphabetical);
    }
}

/**
 * Functional interface for comparing two strings.
 */
@FunctionalInterface
interface StringComparator {
    boolean isBetter(String s1, String s2);
}

/**
 * Utility class for string operations.
 */
class StringUtils {
    public static String betterString(String s1, String s2, StringComparator comparator) {
        if (s1 == null || s2 == null || comparator == null) {
            throw new IllegalArgumentException("Arguments cannot be null");
        }
        
        return comparator.isBetter(s1, s2) ? s1 : s2;
    }
}