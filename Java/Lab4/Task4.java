// Import statement - not needed for basic Java classes, but good practice
// This tells Java which packages/classes we want to use

// Step 1: Create a Functional Interface
// A functional interface is an interface with exactly ONE abstract method
// This interface will define the "contract" for our lambda expressions
@FunctionalInterface
interface TwoStringPredicate {
    // This method takes two strings and returns true/false
    // It will be implemented by our lambda expressions
    boolean isBetter(String s1, String s2);
}

// Step 2: Create the StringUtils class
// This class contains our betterString method
class StringUtils {
    
    // The betterString method takes:
    // - string1: the first string to compare
    // - string2: the second string to compare
    // - predicate: a lambda function that decides which string is better
    public static String betterString(String string1, String string2, TwoStringPredicate predicate) {
        
        // Call the lambda function (predicate) with both strings
        // The lambda will return true if string1 is better, false if string2 is better
        if (predicate.isBetter(string1, string2)) {
            // If the lambda returns true, return the first string
            return string1;
        } else {
            // If the lambda returns false, return the second string
            return string2;
        }
    }
}

// Step 3: Main class to test our code
public class Task4 {
    
    // Main method - this is where our program starts
    public static void main(String[] args) {
        
        // Create two test strings
        String string1 = "Hello";      // Length: 5
        String string2 = "World!!!";   // Length: 8
        
        System.out.println("String 1: " + string1);
        System.out.println("String 2: " + string2);
        System.out.println(); // Empty line for better readability
        
        // Example 1: Find the longer string
        // The lambda (s1, s2) -> s1.length() > s2.length() compares lengths
        // It returns true if s1 is longer than s2
        String longer = StringUtils.betterString(
            string1, 
            string2, 
            (s1, s2) -> s1.length() > s2.length()  // Lambda expression
        );
        System.out.println("Longer string: " + longer);
        
        // Example 2: Always return the first string
        // The lambda (s1, s2) -> true always returns true
        // So it will always pick the first string
        String first = StringUtils.betterString(
            string1, 
            string2, 
            (s1, s2) -> true  // Lambda that always returns true
        );
        System.out.println("First string: " + first);
        
        // Example 3: Always return the second string
        // The lambda (s1, s2) -> false always returns false
        // So it will always pick the second string
        String second = StringUtils.betterString(
            string1, 
            string2, 
            (s1, s2) -> false  // Lambda that always returns false
        );
        System.out.println("Second string: " + second);
        
        // Example 4: Return the string that comes first alphabetically
        // The compareTo method returns a negative number if s1 comes before s2
        String alphabeticallyFirst = StringUtils.betterString(
            string1, 
            string2, 
            (s1, s2) -> s1.compareTo(s2) < 0  // Lambda for alphabetical comparison
        );
        System.out.println("Alphabetically first: " + alphabeticallyFirst);
        
        // Example 5: Return the shorter string
        // This is the opposite of Example 1
        String shorter = StringUtils.betterString(
            string1, 
            string2, 
            (s1, s2) -> s1.length() < s2.length()  // Lambda for shorter string
        );
        System.out.println("Shorter string: " + shorter);
    }
}

/* 
 * EXPLANATION OF KEY CONCEPTS:
 * 
 * 1. FUNCTIONAL INTERFACE (@FunctionalInterface):
 *    - An interface with exactly one abstract method
 *    - Can be implemented using lambda expressions
 *    - The @FunctionalInterface annotation is optional but recommended
 * 
 * 2. LAMBDA EXPRESSION:
 *    - Short way to write anonymous functions
 *    - Syntax: (parameters) -> expression or statement
 *    - Example: (s1, s2) -> s1.length() > s2.length()
 *    - This replaces the need to write a full class implementation
 * 
 * 3. HOW IT WORKS:
 *    - betterString receives a lambda as the third parameter
 *    - The lambda defines the logic for comparing two strings
 *    - betterString calls the lambda and returns the appropriate string
 * 
 * 4. BENEFITS:
 *    - Flexible: You can pass different comparison logic each time
 *    - Clean: No need to create multiple methods for different comparisons
 *    - Reusable: One method works for many different use cases
 */