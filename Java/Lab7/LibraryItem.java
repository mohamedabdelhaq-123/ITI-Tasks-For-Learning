abstract public class LibraryItem {
    // attributes
    protected int id;
    protected String title;

    // getters
     int getId()          // Don't repeat yourself
     {
        return this.id;
     }
     String getTitle()
     {
        return this.title;
     }

     // setters
     void setId(int id)
     {
            this.id=id;
     }
     void setTitle(String title)
     {
            this.title=title;
     }

    // method
   public abstract String getItemDetails() ;
    
}
