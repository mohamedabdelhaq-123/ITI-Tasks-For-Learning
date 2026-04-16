public class Main {
    public static void main(String[] args) {
        LibraryService AlexLibrary = new LibraryService();// Singleton
        AlexLibrary .addBook(new Book("Harry Potter"));
        AlexLibrary .addBook(new Book("Lord of the Rings"));

        User user = new User("John",true);


    }
}
