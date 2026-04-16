import java.util.ArrayList;
import java.util.List;

public class Book implements BookInterface{
    private String title;
    private String author;
    private boolean isAvailable;
    private int year;
    private List<User> waitingList = new ArrayList<>();

    public Book(String title) {
        this.title = title;
        this.isAvailable = true;
        this.author="Anonymous";
        this.year=0;
    }

    public Book(String title,String author,int year) {
        this.title = title;
        this.isAvailable = true;
        this.author=author;
        this.year=year;
    }

    public String getAuthor() {
        return author;
    }

    public int getYear() {
        return year;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public String getTitle() {
        return title;
    }

    public void borrowBook(User user) {
        if (isAvailable) {
            isAvailable = false;
            System.out.println(user.getName()+" "+title + " has been borrowed.");
        } else {
            waitingList.add(user); // instead of observers
            System.out.println(title + " is not available.");
        }
    }

    public void returnBook() {
        isAvailable = true;
        System.out.println(title + " has been returned.");
        
        for (User user : waitingList) {
            System.out.println("NOTIFICATION to " + user.getName() + ": " + title + " is now available!");
        }
        waitingList.clear();
        System.out.println(title + " has been returned.");
    }


}
