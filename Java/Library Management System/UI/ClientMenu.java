
package UI;

import java.util.Scanner;
import Entities.*;       // Import all classes from models package
import Management.*; // Import specific class
import Helpers.*;
import Exceptions.*;
public class ClientMenu extends Menu{   // CRUD client  1=> create client ===> user input (data) ===> call library funcs

    ClientMenu(Scanner ClientScn, Library library)
    {
        this.mainLibrary= library;
        this.genericScn=ClientScn;
        options="=====> Client Menu <=====" +'\n' +"1- Create Clients "+'\n'+ "2- Read Client"+'\n'+"3- Update Clients "+'\n'+ "4- Delete Clients"+'\n' ;
    }

    void chooseOption(int n)
    {
        switch (n) 
        {
            case 1:
                // Create 
                createClient();    
                break;
            case 2:
                // Read
                readClient();
                break;
            case 3:
                // Update
                updateClient();
                break;
            case 4:
                // delete
                deleteClient();
                break;

            default:
                System.out.print("Wrong Choice! Please choose from (1-4) ");
                break;
        }
    }

    void createClient()
    {

        System.out.print("Enter Client ID: ");       int id=UserInput.checkInt(this.genericScn);            // id==> number ==> userinput method 
        System.out.print("Enter Client Name: ");    String name= UserInput.checkAlphabetic(genericScn);     // name ===> string ==>'
        System.out.print("Enter Client Email: ");   String email=UserInput.checkEmail(genericScn);          // email===> regex ===>
        try 
        {
            mainLibrary.addClient(new Client(id, name, email));                                 // new client then, pass data to library
            System.out.println("======> Client: "+ name+ " With ID: "+id+ " Added Successfully <======");
        } 
        catch (ItemAlreadyExistsException e)
        {
            System.out.println(e.getMessage());
        }
    }

    void readClient()
    {
        System.out.print("Enter Client ID: ");       int id=UserInput.checkInt(this.genericScn);            // id==> number ==> userinput method 
        try 
        {
            Client userReadClientData= mainLibrary.getClient(id);                       // new client then, pass data to library
            System.out.println(userReadClientData.getClientDetails(id));
        } 
        catch (ItemNotExistException e)
        {
            System.out.println(e.getMessage());
        }
    }

    void updateClient()
    {
        try 
        {
            System.out.print("Enter Client ID: ");       int id=UserInput.checkInt(this.genericScn);            
            Client userReadClientData= mainLibrary.getClient(id);                       // check if client exists or no

            System.out.print("Enter Client Updated Name: ");    String name= UserInput.checkAlphabetic(genericScn);     // name ===> string ==>'
            userReadClientData.setClientName(name);
            System.out.print("Enter Client Updated Email: ");   String email=UserInput.checkEmail(genericScn);          // email===> regex ===>
            userReadClientData.setEmail(email);

            System.out.println(userReadClientData.getClientDetails(id));
        }
        catch (ItemNotExistException e)
        {
            System.out.println(e.getMessage());
        }
    }


    void deleteClient()
    {
        System.out.print("Enter Client ID: ");       int id=UserInput.checkInt(this.genericScn);            // id==> number ==> userinput method 
        try 
        {
            mainLibrary.removeClient(id);                           // new client then, pass data to library
            System.out.println("======> Client with ID: "+id+ " Removed Successfully <======");
        } 
        catch (ItemNotExistException e)
        {
            System.out.println(e.getMessage());
        }
    }


    
}
