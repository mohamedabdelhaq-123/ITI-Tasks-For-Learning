package Entities;
public class Book extends LibraryItem
{
    private int numberOfPages;

   public Book(int userPages,int userId, String userTitle)
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