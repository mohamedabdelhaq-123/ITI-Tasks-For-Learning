// Import statement - not needed for basic Java classes
// Character class is part of java.lang package which is imported automatically

// Main class to check if a string contains only alphabets
public class Task5 {
    
    // Method to check if a string contains only alphabetic characters
    // Parameters:
    //   str - the string to check
    // Returns:
    //   true if string contains only letters (A-Z, a-z)
    //   false if string contains numbers, spaces, or special characters
    public static boolean containsOnlyAlphabets(String str) {
        
        // First, check if the string is null or empty
        // If it is, we return false (empty string doesn't contain alphabets)
        if (str == null || str.isEmpty()) {
            return false;
        }
        
        // Loop through each character in the string
        // The loop starts at index 0 and goes until the last character
        for (int i = 0; i < str.length(); i++) {
            
            // Get the character at position i
            char currentChar = str.charAt(i);
            
            // Use Character.isLetter() to check if it's an alphabetic character
            // isLetter() returns true for A-Z and a-z
            // isLetter() returns false for numbers, spaces, and special characters
            if (!Character.isLetter(currentChar)) {
                // If we find even ONE non-letter character, return false immediately
                return false;
            }
        }
        
        // If we made it through the entire loop without finding any non-letters,
        // then the string contains only alphabets, so return true
        return true;
    }
    
    // Alternative method using enhanced for loop (for-each loop)
    // This is a cleaner way to iterate through characters in a string
    public static boolean containsOnlyAlphabetsV2(String str) {
        
        // Check if string is null or empty
        if (str == null || str.isEmpty()) {
            return false;
        }
        
        // Convert the string to a character array and loop through it
        // This is called an "enhanced for loop" or "for-each loop"
        for (char ch : str.toCharArray()) {
            
            // Check if the current character is NOT a letter
            if (!Character.isLetter(ch)) {
                return false;  // Found a non-letter, return false
            }
        }
        
        // All characters are letters
        return true;
    }
    
    // Alternative method using Java Streams (more advanced, but good to know)
    // This is a functional programming approach introduced in Java 8
    public static boolean containsOnlyAlphabetsV3(String str) {
        
        // Check if string is null or empty
        if (str == null || str.isEmpty()) {
            return false;
        }
        
        // Use chars() to get a stream of characters
        // allMatch checks if ALL characters satisfy the condition
        // Character::isLetter is a method reference (shorthand for lambda)
        return str.chars().allMatch(Character::isLetter);
    }
    
    // Main method - this is where the program starts executing
    public static void main(String[] args) {
        
        // Test Case 1: String with only alphabets (lowercase)
        String test1 = "hello";
        System.out.println("Test 1: \"" + test1 + "\"");
        System.out.println("Contains only alphabets? " + containsOnlyAlphabets(test1));
        System.out.println(); // Empty line for readability
        
        // Test Case 2: String with only alphabets (mixed case)
        String test2 = "HelloWorld";
        System.out.println("Test 2: \"" + test2 + "\"");
        System.out.println("Contains only alphabets? " + containsOnlyAlphabets(test2));
        System.out.println();
        
        // Test Case 3: String with numbers
        String test3 = "Hello123";
        System.out.println("Test 3: \"" + test3 + "\"");
        System.out.println("Contains only alphabets? " + containsOnlyAlphabets(test3));
        System.out.println();
        
        // Test Case 4: String with spaces
        String test4 = "Hello World";
        System.out.println("Test 4: \"" + test4 + "\"");
        System.out.println("Contains only alphabets? " + containsOnlyAlphabets(test4));
        System.out.println();
        
        // Test Case 5: String with special characters
        String test5 = "Hello!";
        System.out.println("Test 5: \"" + test5 + "\"");
        System.out.println("Contains only alphabets? " + containsOnlyAlphabets(test5));
        System.out.println();
        
        // Test Case 6: Empty string
        String test6 = "";
        System.out.println("Test 6: \"" + test6 + "\" (empty string)");
        System.out.println("Contains only alphabets? " + containsOnlyAlphabets(test6));
        System.out.println();
        
        // Test Case 7: Only numbers
        String test7 = "12345";
        System.out.println("Test 7: \"" + test7 + "\"");
        System.out.println("Contains only alphabets? " + containsOnlyAlphabets(test7));
        System.out.println();
        
        // Test Case 8: Mixed everything
        String test8 = "Test@123";
        System.out.println("Test 8: \"" + test8 + "\"");
        System.out.println("Contains only alphabets? " + containsOnlyAlphabets(test8));
        System.out.println();
        
        // Demonstrate that all three methods produce the same results
        System.out.println("=== Comparing All Three Methods ===");
        String testString = "JavaProgramming";
        System.out.println("Test String: \"" + testString + "\"");
        System.out.println("Method 1 (regular for loop): " + containsOnlyAlphabets(testString));
        System.out.println("Method 2 (enhanced for loop): " + containsOnlyAlphabetsV2(testString));
        System.out.println("Method 3 (Java Streams): " + containsOnlyAlphabetsV3(testString));
    }
}

/*
 * EXPLANATION OF KEY CONCEPTS:
 * 
 * 1. Character.isLetter() METHOD:
 *    - This is a static method from the Character class
 *    - It checks if a character is a letter (A-Z or a-z)
 *    - Returns true for alphabetic characters
 *    - Returns false for numbers, spaces, punctuation, etc.
 *    - Works with both uppercase and lowercase letters
 * 
 * 2. STRING TRAVERSAL METHODS:
 *    - Method 1: Traditional for loop with charAt(i)
 *      * Most explicit and beginner-friendly
 *      * Good for understanding indexing
 *    
 *    - Method 2: Enhanced for loop with toCharArray()
 *      * Cleaner syntax
 *      * No need to manage index manually
 *    
 *    - Method 3: Java Streams
 *      * Modern functional approach
 *      * More concise but requires understanding of streams
 * 
 * 3. EARLY RETURN:
 *    - When we find a non-letter, we return false immediately
 *    - No need to check the rest of the string
 *    - This makes the code more efficient
 * 
 * 4. NULL AND EMPTY CHECK:
 *    - Always important to check for null to avoid NullPointerException
 *    - Empty string check depends on your requirements
 *    - Here, we treat empty strings as "not containing only alphabets"
 * 
 * 5. THE LOGIC:
 *    - If ANY character is not a letter, return false
 *    - If ALL characters are letters, return true
 *    - This is implemented using the negation operator (!)
 */