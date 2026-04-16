public interface Borrowable { // common mehtods in book

    void borrowBook(User user);
    void returnBook();
    boolean isAvailable();
    String getTitle();
    int getBorrowDays(); // for normal and premium books
}
