package Management;

import java.util.TreeMap;
import Entities.*;
import Exceptions.*;
// new thing like method or func ==> <? or T extends LibraryItem>
// old       like Arraylist ===> <LibraryItem>
public class Library  
{
    // declare lists iteams and clients
    private TreeMap<Integer,LibraryItem> libraryItems;       // library items, books, maga.
    // insertion in treemap log n ,, map 1

    //  private ArrayList<book> book;  => reduduncay and usage of abstract class to deal with children as one thing in DB
    private TreeMap<Integer,Client> Clients; 
    public Library()
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
