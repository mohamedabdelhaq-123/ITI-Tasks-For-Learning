public class LibraryFacade {
    private LibraryService libraryService;
    private BookCreator bookCreator;
    private BookAdapter jsonAdapter; // inject for json books

    public LibraryFacade(BookCreator bookCreator,String jsonData){
        this.libraryService = LibraryService.getInstance();
        this.bookCreator = bookCreator;
        this.jsonAdapter= new BookAdapter(new JsonBook(jsonData));
    }

    public LibraryFacade(BookCreator bookCreator)
    {
        this.libraryService = LibraryService.getInstance();
        this.bookCreator = bookCreator;
    }

    public void addBookFromJson(String jsonData){
        Book book = jsonAdapter.getBook();
        libraryService.addBook(book);   
    }

    public void borrowBook(String title,String user_name){
        User user = new User(user_name);
        Book book = bookCreator.createBook(title);
        libraryService.addBook(book);
        Librarian librarian = new Librarian();
        librarian.processBorrowRequest(title, user);
    }

    public void returnBook(String title){
        Librarian librarian = new Librarian();
        librarian.processReturnRequest(title);
    }
}
