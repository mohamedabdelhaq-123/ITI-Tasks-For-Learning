/*
 Design a class hierarchy for a simple Library Management System:

   - Create an abstract class `LibraryItem` with properties like `id` and `title`.
   - Extend `LibraryItem` to create subclasses `Book` and `Magazine`.
   - Add a method `getItemDetails()` to return item details.

   2. Implement a custom exception `ItemNotFoundException` that is thrown when a library item is not found.

   3. Create a `Library` class to manage a collection of `LibraryItem` objects:

   - Use generics and wildcards to allow adding and retrieving items of any subclass of `LibraryItem`.

   - Implement methods to add, retrieve, and display items.

*/

// only thing needed from book client mag to know data about them or set 
// Library: take data about things 
// ui: take input form user and implement the function user need


import java.util.Scanner;
import java.util.TreeMap;

public class main {
    public static void main(String args[])
    {
        MainMenu start= new MainMenu();
        start.runMenu();

    }
    
}

// new thing like method or func ==> <? or T extends LibraryItem>
// old       like Arraylist ===> <LibraryItem>
class Library  
{
    // declare lists iteams and clients
    private TreeMap<Integer,LibraryItem> libraryItems;       // library items, books, maga.
    //  private ArrayList<book> book;  => reduduncay and usage of abstract class to deal with children as one thing in DB
    private TreeMap<Integer,Client> Clients; 
    Library()
    {
        libraryItems =new TreeMap<>();
        Clients = new TreeMap<>();
        // init list

    }
    
/***********************************************   Add Item or Client  ********************************************************************** */
    // add item for book or mag
    public void addItem (LibraryItem obj) throws ItemAlreadyExistsException      // menu give sth       
    {
        // book mag 
        if(libraryItems.containsKey(obj.getId()))
        {
            throw new ItemAlreadyExistsException("==========Item already Exists==========");   
        }
        libraryItems.put(obj.getId(),obj);
    }

    public void addClient (Client obj) throws ItemAlreadyExistsException      // menu give sth       
    {
        if(Clients.containsKey(obj.getId()))
        {
            throw new ItemAlreadyExistsException("==========Client already Exists==========");   
        }
        Clients.put(obj.getId(),obj);
    }


/***********************************************   Remove Item or Client  ********************************************************************** */

    public void removeItem(int id) throws ItemNotExistException             // remove item from book or mag
    {
        if(!libraryItems.containsKey(id))
        {
            throw new ItemNotExistException("========== Item doesn't exist to be removed ==========");   
        }
        libraryItems.remove(id);
    }
    

    public void removeClient(int id) throws ItemNotExistException             // remove  client
    {
        if(!Clients.containsKey(id))
        {
            throw new ItemNotExistException("========== Client doesn't exist to be removed ==========");   
        }
        Clients.remove(id);
    }


/***********************************************   Get Item or Client  ********************************************************************** */


    // send item to menu to display
    public LibraryItem getItem(int id) throws ItemNotExistException    // book id 22 found or no  // id is primary key
    {                                                          
        if(!libraryItems.containsKey(id))
        {
            throw new ItemNotExistException("========== Item Doesn't Exist ==========");   // like a return
        }

        return libraryItems.get(id);    // found the item and ret to menu    
    }

        // send CLient to menu to display
    public Client getClient(int id) throws ItemNotExistException    
    {                                                          
        if(!Clients.containsKey(id))
        {
            throw new ItemNotExistException("========== Client Doesn't Exist ==========");   // like a return
        }

        return Clients.get(id);    // found the Client and ret to menu    
    }

}


class Client 
{
    private int id;
    private String clientName;
    private String email;

    // const.
    Client(int id,String name,String email)
    {
        this.id=id;
        this.clientName=name;
        this.email=email;
    }

    // getters
    int getId(){return this.id;}
    String getClientName(){return this.clientName;}
    String getEmail(){return this.email;}

    // setters
    void setId(int id){this.id=id;}
    void setClientName(String name){this.clientName=name;}
    void setEmail(String email){this.email=email;}

    // methods
    String getClientDetails(int id)
    {
        // code
        return "======> Client Data <====== "+'\n'+   "Client: "+this.clientName+'\n'+"ID: "+this.id+ '\n'+"Email: "+this.email;

        //System.out.println("Name: "+this.clientName+" ID: "+this.id+" Email: "+this.email);
    }



}


class Book extends LibraryItem
{
    private int numberOfPages;

    Book(int userPages,int userId, String userTitle)
    {
        this.id= userId;
        this.numberOfPages=userPages;
        this.title=userTitle;
    }


    public void setNumberofPages(int pages){this.numberOfPages= pages;}
    public int getNumberofPages(){return this.numberOfPages;}


//if parent throw excep x, so as a child i can throw anything except new checked exception (don't throw, throw unchecked, old checked"parent checked")
// throws ItemNotFoundException, IOException 

    @Override
    public String getItemDetails()   // optional to put throws 
    {       
        return "======> Book Data <====== "+'\n'+"Book ID: " +this.id+'\n' +"Book Name: " +this.title+'\n' +"Number of Pages: " +this.numberOfPages  ;                                              
        
    }
}

class Magazine extends LibraryItem 
{
    private int numberOfPages;

    Magazine(int userPages,int userId, String userTitle)
    {
         // same
        this.id= userId;
        this.numberOfPages=userPages;
        this.title=userTitle;
    }

    public void setNumberofPages(int pages){this.numberOfPages= pages;}
    public int getNumberofPages(){return this.numberOfPages;}



    @Override
    public String getItemDetails() 
    {
        return "======> Magazine Data <====== "+'\n'+"Magazine ID: " +this.id+'\n' +"Magazine Title: " +this.title+'\n' +"Number of Pages: " +this.numberOfPages  ;                                              
        
    }

}



class ItemNotExistException extends Exception{

    ItemNotExistException(String message)
    {
        super(message);
    }

}

class ItemAlreadyExistsException extends Exception{

    ItemAlreadyExistsException(String message)
    {
        super(message);
    }

}



/*
Create a program that integrates OOP, exception handling, generics, and wildcards. Follow these steps:

1. Design a class hierarchy for a simple Library Management System:
   - Create an abstract class `LibraryItem` with properties like `id` and `title`.
   - Extend `LibraryItem` to create subclasses `Book` and `Magazine`.
   - Add a method `getItemDetails()` to return item details.

2. Implement a custom exception `ItemNotFoundException` that is thrown when a library item is not found.

3. Create a `Library` class to manage a collection of `LibraryItem` objects:
   - Use generics and wildcards to allow adding and retrieving items of any subclass of `LibraryItem`.
   - Implement methods to add, retrieve, and display items.

4. Design a class hierarchy for library clients:
   - Create a `Client` class with properties like `id`, `name`, and `email`.
   - Add a method `getClientDetails()` to display client information.

5. Implement a menu system to provide CRUD (Create, Read, Update, Delete) functionalities for:
   - Library items (e.g., add books/magazines, retrieve item details, update or delete items).
   - Library clients (e.g., add clients, retrieve client details, update or delete clients).

6. In the main method:
   - Create instances of `Book`, `Magazine`, and `Client`.
   - Use the menu system to demonstrate CRUD operations for both library items and clients.

*/

// user
// Menu: Iteam or client
// 

abstract class  Menu{                    

    protected String options;
    protected Scanner genericScn;
    Library mainLibrary;

    void printOptions()
    {
        System.out.println();
        System.out.println(options);
    }

    void runMenu()  // input scanner
    {
        while (true) 
        {
            printOptions();
            String input=genericScn.nextLine();
            try 
            {
                int userChoice= Integer.parseInt(input);  // convert to integer
               
                if(userChoice==0)
                    break;
                else
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



class MainMenu extends Menu{  // Iteam or client

    private ClientMenu objClientMenu;
    private ItemMenu objItemMenu;

    MainMenu()
    {
        this.mainLibrary= new Library();
        this.genericScn= new Scanner(System.in);
        objClientMenu= new ClientMenu(this.genericScn,this.mainLibrary);
        objItemMenu =new ItemMenu(this.genericScn,this.mainLibrary);
        options="=====> Main Menu <=====" +'\n'+ "1- Clients "+ '\n' + "2- Iteams"+ '\n' + "0- Exit Main Menu";
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
            case 0:
                System.out.println("Exiting system...");
                break;
            default:
                System.out.println("Invalid choice! Please choose 0-2");
                break;
        }
    }



}

class ClientMenu extends Menu{   // CRUD client  1=> create client ===> user input (data) ===> call library funcs

    ClientMenu(Scanner ClientScn, Library library)
    {
        this.mainLibrary= library;
        this.genericScn=ClientScn;
        options="=====> Client Menu <=====" +'\n' +"1- Create Clients "+'\n'+ "2- Read Client"+'\n'+"3- Update Clients "+'\n'+ "4- Delete Clients"+'\n'+ "0- Exit Client Menu "+'\n' ;
    }

    void chooseOption(int n)
    {
        switch (n) 
        {
            case 0:
                System.out.println("Returning to Main Menu...");
                break;
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



class ItemMenu extends Menu{  ///

    ItemMenu(Scanner ItemScn, Library library)
    {
        this.mainLibrary= library;
        this.genericScn=ItemScn;
        options="=====>Item Menu<====="+'\n'+"1- Create Item "+'\n'+ "2- Read Item"+'\n'+"3- Update Item "+'\n'+ "4- Delete Item"+'\n'+ "0- Exit Item Menu"+'\n' ;
    }

    void chooseOption(int n)
    {
        switch (n) 
        {
            case 0:
                System.out.println("Returning to Main Menu...");
                break;
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


class UserInput{  // functions data from user in strings int,....


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

/*
*Additional Requirements*

1. Relation between Client and Library Items:

Establish a relationship between Client and LibraryItem where a client can rent or borrow items.

Each Client should have a collection of borrowed library items.



2. Borrow/Rent Feature:

Add a stock property to each library item to manage multiple copies of the same item.

Alternatively, manage a single copy per item with an availability property (boolean or enum).

Add two methods in the menu:

borrowItem(userId, itemId): Allows a client to borrow an item.

returnItem(itemId, userId): Allows a client to return an item.




3. Use of Streams:

Use Java streams for operations such as filtering library items or finding a client by ID.

Ensure streams are used wherever applicable for efficiency and simplicity.



4. Validations:

Ensure unique IDs across all entities (LibraryItem and Client).

Validate user input, such as checking for item availability or verifying client and item IDs before processing requests.





---

BONUS

5. Interfaces:

Create a CRUD interface implemented by both LibraryItem and Client.

Define methods like create, read, update, and delete in the interface.



6. User-Friendly Menu:

Design a clear and user-friendly menu system with descriptive instructions.

Include meaningful error messages for invalid operations.




*Reminder* : please if there's any additional assumptions please write it down
*/