import java.util.StringTokenizer;

public class Task2
{
    public static void main(String[] args) 
	{
        String sentenceToBeTokenized = "ITI develops people and ITI house of developers and ITI for people";
        String wordToTokeniz = "ITI";

        StringTokenizer tokenizerObj = new StringTokenizer(sentenceToBeTokenized, wordToTokeniz);  // obj to 
        while (tokenizerObj.hasMoreTokens())  
        {
            System.out.println("Token is: " + tokenizerObj.nextToken());
        }
    }
}