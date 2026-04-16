public class HistoricalBookCreator implements BookCreator{  // concrete creator to apply loose coupling
    
    @Override
    public Book createBook(String title) {
        return new HistoricalBook(title); // return new instance from the implemented class
    }
}
    