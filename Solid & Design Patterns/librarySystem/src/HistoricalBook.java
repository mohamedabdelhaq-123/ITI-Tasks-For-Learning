public class HistoricalBook extends Book {
    public HistoricalBook(String title) {
        super(title);
    }
    @Override
    public void borrowBook(User user) {
        System.out.println("Historical Book: "+super.getTitle() + " has been borrowed by " + user.getName() + ".");

    }
 }
