public class PhysicalBookCreator implements BookCreator{  // concrete creator to apply loose coupling
    
    @Override
    public Book createBook(String title) {
        return new PhysicalBook(title); // return new instance from the implemented class
    }
}
