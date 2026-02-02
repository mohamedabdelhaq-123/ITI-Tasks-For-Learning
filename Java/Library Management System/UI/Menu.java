
// user
// Menu: Iteam or client
// 
package UI;

import java.util.Scanner;
import Management.*; // Import specific class

abstract class  Menu{                    

    protected String options;
    protected Scanner genericScn;
    Library mainLibrary;

    public void printOptions()
    {
        System.out.println();
        System.out.println(options);
    }

    public void runMenu()  // input scanner
    {
        while (true) 
        {
            printOptions();
            String input=genericScn.nextLine();
            try 
            {
                int userChoice= Integer.parseInt(input);  // convert to integer
                chooseOption(userChoice);
            } 
            catch (Exception e) 
            {
                System.out.println("Invalid Choice.");
            }

        }
    }

    // scanner
    abstract void chooseOption(int n);

    
}