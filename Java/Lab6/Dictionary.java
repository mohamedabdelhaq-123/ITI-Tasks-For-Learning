/*Lab Exercise
• Simple Word Dictionary
• Create a map that uses the alphabets as keys and a collection as values (This collection should only contain
words starting with the corresponding key)
• Develop an application that stores words into that collection.
• Elements in the words map for each alphabet should be sorted   
• Provide methods to print all the letters and corresponding words
• Provide a method to print the words of a given letter*/



// use TreeMap bec, keys are automatically sorted
// key is letter and value will be multiple values and soooorted


import java.util.*;

class Dict
{
    public static void main(String args[])
    {


        Dictionary d=new Dictionary();
        d.addWord("Momo");
        d.addWord("Khail");
        d.addWord("Ahmed");
        d.addWord("omo");
        d.addWord("hail");
        d.addWord("ed");
        d.addWord("Mhail");
        d.addWord("MDDd");
        d.printMap();
        d.printCharWord('M');
        d.printCharWord('P');

        System.out.print(d);
    }


}



class Dictionary
{

    // map 
    // methods                                     // Treemap sort keys but treeset sort values
    private TreeMap<Character,TreeSet<String>> map;   // decl. map that key is char and value is Treeset of strings in map obj
    Dictionary()                                                                   // TreeSet for automatic sorting
    {   
        map = new TreeMap<>();  // init map 
        for(Character i='A';i<='Z';i++)               // each key is captial and created its own empty set of values
        {
            map.put(i, new TreeSet<String>());
        }  
    }

    // search on treemap and sortedmap ,, treeset and sortedset

 void addWord(String word)      ////// ISSUE: validation
    {
        Character c= word.charAt(0);
        c = Character.toUpperCase(c); // conveted first letter in string to uppercase
        if(map.containsKey(c)) ///// issue : un necessary check bec will ALWAYS be true for A-Z due to const.
        {
            TreeSet<String> s =map.get(c);   // map.get() returns the treeset "Value of key c" of the letter c
            s.add(word);            
        }// words are sorted auto
    }

    void printMap()
    {
        for(Character c='A';c<='Z';c++)
        {
            TreeSet<String> T=map.get(c);
            System.out.println("Key: "+c +"==> "+"Value: "+ T);
        }
    }

    void printCharWord(Character c)
    {
        if(map.containsKey(Character.toUpperCase(c)))
        {
            TreeSet<String> T=map.get(c);    ///// ISSue: c must be capital
            System.out.println("Key: "+c +"==> "+"Value: "+ T);
        }
        else
            System.out.println("Not Included");
    }

     @Override
    public String toString()
    {
        StringBuilder sb= new StringBuilder();
        for(Character c: map.keySet())
        {
            sb.append("Key: ");
            sb.append(c);
            sb.append("  ====> ");
            sb.append("Value: ");
            sb.append(map.get(c));
            sb.append('\n');
        }
        return sb.toString();

        


        // letter ==> words
        // get ===> ret treeset
        // loop on each letter
        // in each letter map.get(letter)
        // print the treeset 
        //return "Key: "+ map. +" Value: "+ this.s;
    }

} 