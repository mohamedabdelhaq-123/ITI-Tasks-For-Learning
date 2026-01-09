/*import java.util.*;

class BestPractice
{
    public static void main(String[] args)
    {
        Dictionary dict = new Dictionary();
        
        dict.addWord("Momo");
        dict.addWord("Khalil");
        dict.addWord("Ahmed");
        dict.addWord("omo");
        dict.addWord("hail");
        
        // Print everything
        System.out.println(dict);
        
        // Print specific letters
        dict.printWordsForLetter('M');
        dict.printWordsForLetter('P');  // Not found
    }
}

class Dictionary
{
    private TreeMap<Character, TreeSet<String>> map;
    
    public Dictionary()
    {
        map = new TreeMap<>();
        
        // Pre-populate A-Z with empty sets
        for(char c = 'A'; c <= 'Z'; c++)
        {
            map.put(c, new TreeSet<>());
        }
    }
    
    public void addWord(String word)
    {
        // Input validation
        if(word == null || word.isEmpty())
        {
            System.out.println("Error: Cannot add null or empty word");
            return;
        }
        
        char firstChar = Character.toUpperCase(word.charAt(0));
        
        // Check if it's a letter
        if(!Character.isLetter(firstChar))
        {
            System.out.println("Error: Word must start with a letter");
            return;
        }
        
        // Add word (safe because we pre-populated all letters)
        map.get(firstChar).add(word);
    }
    
    public void printWordsForLetter(Character letter)
    {
        letter = Character.toUpperCase(letter);
        
        if(map.containsKey(letter))
        {
            TreeSet<String> words = map.get(letter);
            
            if(words.isEmpty())
            {
                System.out.println(letter + " => No words found");
            }
            else
            {
                System.out.println(letter + " => " + words);
            }
        }
        else
        {
            System.out.println("Letter '" + letter + "' not in dictionary");
        }
    }
    
    @Override
    public String toString()
    {
        StringBuilder sb = new StringBuilder();
        sb.append("=== Dictionary Contents ===\n\n");
        
        for(Character letter : map.keySet())
        {
            TreeSet<String> words = map.get(letter);
            
            // Only show letters with words
            if(!words.isEmpty())
            {
                sb.append(letter).append(" => ");
                sb.append(words).append("\n");
            }
        }
        
        return sb.toString();
    }
}*/