public abstract class BookDecorator implements Borrowable {
    protected Book decoratedBook;

    public BookDecorator(Book decoratedBook) {
        this.decoratedBook = decoratedBook;
    }

    @Override
    public void borrowBook(User user) {
        decoratedBook.borrowBook(user);
    }

    @Override
    public void returnBook() {
        decoratedBook.returnBook();
    }

    @Override
    public boolean isAvailable() {
        return decoratedBook.isAvailable();
    }

    @Override
    public String getTitle() {
        return decoratedBook.getTitle();
    }

    @Override
    public abstract int  getBorrowDays(); // implemented by children (normal & premium book)

}
