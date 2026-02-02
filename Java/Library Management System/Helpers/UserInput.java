package Helpers;
import java.util.Scanner;
public class UserInput{  // functions data from user in strings int,....


    // Static Method read int  alphaString
    
    public static int checkInt(Scanner userScn)
    {
        int value=0;
        while (true)
        {
            String input=userScn.nextLine();
            try 
            {
                value= Integer.parseInt(input);  // convert to integer
                return value;
            } 
            catch (NumberFormatException e) 
            {
                System.out.println("Please enter a valid Integer!!");
            }
        }
    }


    public static String checkAlphabetic(Scanner userScn)
    {
        while (true) 
        {
            String input=userScn.nextLine();
            if(input.matches("^[a-zA-Z]*$")) 
            {
                return input;
            }
            System.out.println("Please enter a valid Alphabetic!!");
        }
    }

    public static String checkEmail(Scanner userScn)
    {
        while (true) 
        {
            String input=userScn.nextLine();
            if(input.matches("^[a-zA-Z]+@[a-z]+\\.com$"))    // "^[a-zA-Z]*[@[a-z].com]$" ==> start with anyletter *(zero or more) then one char from @,a-z,.,c,.... then end string by$
            {                                                    // "^[a-zA-Z]*@[a-z]*\\.[com]$")) ==> same by there must be @ and . ==> matches @m.c or m@.o etc..
                return input;                               // "^[a-zA-Z]+@[a-z]+\\.[com]$")) ==> there is no zero option in + ==> matches a@a.c
            }
            System.out.println("Please enter a valid Email!!");
        }
    }
}


// crud client iteams
// remove client
// get in library
// email done
// choice to exit terminal
// choice to go back to the prev menu