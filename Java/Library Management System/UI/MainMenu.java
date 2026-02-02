package UI;

import java.util.Scanner;
import Management.*; // Import specific class

public class MainMenu extends Menu{  // Iteam or client

    private ClientMenu objClientMenu;
    private ItemMenu objItemMenu;

   public MainMenu()
    {
        this.mainLibrary= new Library();
        this.genericScn= new Scanner(System.in);
        objClientMenu= new ClientMenu(this.genericScn,this.mainLibrary);
        objItemMenu =new ItemMenu(this.genericScn,this.mainLibrary);
        options="=====> Main Menu <=====" +'\n'+ "1- Clients "+ '\n' + "2- Iteams";
    }

    void chooseOption(int n)
    {
        switch (n) {
            case 1:
                // client menu
                objClientMenu.runMenu();   // forward to client menu
                break;
            case 2:
                // iteam menu
                objItemMenu.runMenu();
                break;

            default:

                break;
        }
    }



}
