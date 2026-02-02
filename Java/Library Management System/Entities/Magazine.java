package Entities;
public class Magazine extends LibraryItem 
{
    private int numberOfPages;

    public Magazine(int userPages,int userId, String userTitle)
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