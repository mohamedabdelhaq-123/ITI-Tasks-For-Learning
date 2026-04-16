public class PremiumBook extends BookDecorator {
    
    private static int extraDays=10;
    public PremiumBook(Book decoratedBook) {
        super(decoratedBook);
    }

    @Override
    public void borrowBook(User user) {
        if (user.isPremium()) {
            super.borrowBook(user);
        } else {
            System.out.println("Premium book can only be borrowed by premium users.");
        }
    }

    @Override
    public int getBorrowDays(){
        return 5+ extraDays;
    }
}
