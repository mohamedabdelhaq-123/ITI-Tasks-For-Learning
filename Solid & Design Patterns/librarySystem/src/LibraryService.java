import java.util.ArrayList;
import java.util.List;

public class LibraryService {
    private LibraryService instance;
    private List<Book> books = new ArrayList<>();

    LibraryService(){

    }
    public void addBook(Book book) {
        books.add(book);
    }

    public Book findBook(String title) {
        for (Book book : books) {
            if (book.getTitle().equalsIgnoreCase(title)) {
                return book;
            }
        }
        return null;
    }

    public void borrowBook(String title,User user) {
        Book book = findBook(title);
        if (book != null) {
            book.borrowBook(user);
        } else {
            System.out.println("Book not found.");
        }
    }

    public void returnBook(String title) {
        Book book = findBook(title);
        if (book != null) {
            book.returnBook();
        } else {
            System.out.println("Book not found.");
        }
    }
}
