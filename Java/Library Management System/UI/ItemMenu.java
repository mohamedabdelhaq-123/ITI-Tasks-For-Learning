
package UI;

import java.util.Scanner;
import Entities.*;       // Import all classes from models package
import Management.*; // Import specific class
import Helpers.*;
import Exceptions.*;
public class ItemMenu extends Menu{  ///


    ItemMenu(Scanner ItemScn, Library library)
    {
        this.mainLibrary= library;
        this.genericScn=ItemScn;
        options="=====>Item Menu<====="+'\n'+"1- Create Item "+'\n'+ "2- Read Item"+'\n'+"3- Update Item "+'\n'+ "4- Delete Item"+'\n' ;
    }

    void chooseOption(int n)
    {
        switch (n) 
        {
            case 1:
                // Create 
                createItem();
                break;
            case 2:
                // Read
                readItem();
                break;
            case 3:
                // Update
                updateItem();
                break;
            case 4:
                // delete
                deleteItem();
                break;

            default:
                System.out.println("Wrong Choice!! (1-4)");
                break;
        }
    }


    void createItem()
    {

        System.out.println("1- Create Book "+'\n'+ "2- Create Magazine "+'\n');  int choice=UserInput.checkInt(this.genericScn);

        System.out.print("Enter ID: ");           int id=UserInput.checkInt(this.genericScn);            // id==> number ==> userinput method 
        System.out.print("Enter Name: ");              String name= UserInput.checkAlphabetic(genericScn);     // name ===> string ==>'
        System.out.print("Enter Number of Pages: ");   int nOfPages=UserInput.checkInt(genericScn);          // email===> regex ===>
        switch (choice) 
        {
            case 1:
                    try 
                    {
                        Book book = new Book(nOfPages, id, name);
                        mainLibrary.addItem(new Book(nOfPages, id, name));
                        System.out.println(book.getItemDetails());
                        System.out.println("======> Book: "+ name+ " With ID: "+id+ " Added Successfully <======");
                    } 
                    catch (ItemAlreadyExistsException e)
                    {
                        System.out.println(e.getMessage());
                    }
                break;

            case 2:
                try 
                {
                    Magazine magazine = new Magazine(nOfPages, id, name);
                    mainLibrary.addItem(magazine);
                    System.out.println(magazine.getItemDetails());
                    System.out.println("======> Magazine: "+ name+ " With ID: "+id+ " Added Successfully <======");
                } 
                catch (ItemAlreadyExistsException e)
                {
                      System.out.println(e.getMessage());
                }
                break;

            default:
                    System.out.println("Wrong Choice Choose 1-2");
                break;
        }
    }


    void readItem()
    {
        System.out.print("Enter Item ID: ");       int id=UserInput.checkInt(this.genericScn);            // id==> number ==> userinput method 
        try 
        {
            LibraryItem userReadItemData= mainLibrary.getItem(id);    // retrun back obj from item by id
            System.out.println(userReadItemData.getItemDetails());   // obj data returned in string
        } 
        catch (ItemNotExistException e)
        {
            System.out.println(e.getMessage());
        }
    }


    void updateItem()
    {

        System.out.println("1- Update Book "+'\n'+ "2- Update Magazine "+'\n');  int choice=UserInput.checkInt(this.genericScn);
        try 
        {
            System.out.print("Enter ID: ");       int id=UserInput.checkInt(this.genericScn);            
            LibraryItem userReadItemData= mainLibrary.getItem(id);                       // check if client exists or no

            System.out.print("Enter Updated Name: ");    String name= UserInput.checkAlphabetic(genericScn);     // name ===> string ==>'
            userReadItemData.setTitle(name);
            System.out.print("Enter Updated Number Of Pages: ");   int nofpages=UserInput.checkInt(genericScn);          // email===> regex ===>
                if(choice==1)
                {
                    Book book= (Book) userReadItemData;
                    book.setNumberofPages(nofpages);
                   // System.out.println(userReadItemData.getItemDetails());
                }
                else if(choice==2)
                {
                    Magazine magazine =(Magazine) userReadItemData;
                    magazine.setNumberofPages(nofpages);
                   // System.out.println(userReadItemData.getItemDetails());
                }
                else
                {
                    System.out.println("Wrong Choice Choose 1-2");
                    return;
                }
                System.out.println(userReadItemData.getItemDetails());

            
        }
        catch (ItemNotExistException e)
        {
            System.out.println(e.getMessage());
        }
    
    }


    void deleteItem()
    {
        try 
        {
            System.out.println("Enter Item ID: "+'\n');  int id=UserInput.checkInt(this.genericScn);
            mainLibrary.removeItem(id);           
            System.out.println("======> Item with ID: "+id+ " Removed Successfully <======");

        } 
        catch (ItemNotExistException e)
        {
            System.out.println(e.getMessage());
        }
    }
}

