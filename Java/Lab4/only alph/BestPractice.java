public class BestPractice {
    public static void main(String[] args) {
        // Test cases
        String[] testStrings = {
            "mdomodmd",      // All letters
            "hello123",      // Has numbers
            "HelloWorld",    // All letters
            "test space",    // Has space
            "",              // Empty
            "ABC"            // All uppercase
        };
        
        for (String test : testStrings) {
            System.out.println("Testing: \"" + test + "\"");
            
            if (StringValidator.isAllAlphabetic(test)) {
                System.out.println("Contains only alphabetic characters\n");
            } else {
                System.out.println("Contains non-alphabetic characters\n");
            }
        }
    }
}

class StringValidator {
    
    public static boolean isAllAlphabetic(String str) 
    {
        // Handle edge cases
        if (str == null || str.isEmpty()) 
        {
            return false;
        }
        
        // Check each character
        for (int i = 0; i < str.length(); i++) 
        {
            if (!Character.isLetter(str.charAt(i))) 
            {
                return false;  // Early return on first non-letter
            }
        }
        return true;  // All characters are letters
    }
}