public class Main {
    public static void main(String[] args) {
        // LibraryService AlexLibrary = new LibraryService();// Singleton
        LibraryService AlexLibrary = LibraryService.getInstance();
        // AlexLibrary.addBook(new Book("Harry Potter"));
        // AlexLibrary.addBook(new Book("Lord of the Rings"));

        BookCreator ebookCreator = new EBookCreator();
        BookCreator historycalBookCreator = new HistoricalBookCreator();
        
        AlexLibrary.addBook(ebookCreator.createBook("Atomic Habits"));
        AlexLibrary.addBook(historycalBookCreator.createBook("Lord of the Rings"));

        User user = new User("John",true);
        System.out.println(user.getName());


        Book ebook = new EBook("Design Patterns");
        PremiumBook premiumEbook = new PremiumBook(ebook);

        System.out.println(premiumEbook.getBorrowDays());


        Librarian librarian = new Librarian();
        librarian.processBorrowRequest("Atomic Habits", user);
        librarian.processReturnRequest("Atomic Habits");


        LibraryFacade library = new LibraryFacade(new PhysicalBookCreator());
        library.borrowBook("Atomic Habits", "John");
        library.returnBook("Atomic Habits");


        String externalJson = "{\"isBorrowable\": true, \"bookTitle\": \"Design Patterns\", \"authorName\": \"Erich Gamma\", \"year\": 1994}";
        LibraryFacade library2= new LibraryFacade(new PhysicalBookCreator(),externalJson);
        library2.addBookFromJson(externalJson);
        library2.borrowBook("Design Patterns" , "John");
        
    }
}
