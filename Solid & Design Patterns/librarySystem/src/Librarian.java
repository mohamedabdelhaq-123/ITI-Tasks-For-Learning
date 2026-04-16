public class Librarian {
    private LibraryService libraryService;

    public Librarian(){
        this.libraryService = LibraryService.getInstance();
    }
    
    public void processBorrowRequest(String title,User user){
        libraryService.borrowBook(title, user); // the librarian is proxy btw service and user
    }

    public void processReturnRequest(String title){
        libraryService.returnBook(title);
    }   
}
