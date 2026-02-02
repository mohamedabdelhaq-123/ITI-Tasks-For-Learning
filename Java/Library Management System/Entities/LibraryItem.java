package Entities;
abstract public class LibraryItem {
    // attributes
    protected int id;
    protected String title;

    // access specifiers ,,modifiers

    // getters
     public int getId()          // Don't repeat yourself
     {
        return this.id;
     }
     public String getTitle()
     {
        return this.title;
     }

     // setters
     public void setId(int id)
     {
            this.id=id;
     }
     public void setTitle(String title)
     {
            this.title=title;
     }

    // method
   public abstract String getItemDetails() ;
    
}
