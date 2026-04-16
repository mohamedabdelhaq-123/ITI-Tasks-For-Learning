public class PhysicalBook extends Book{

    public PhysicalBook(String title) {
        super(title);
    }

    @Override
    public void borrowBook(User user) {
        System.out.println("Physical Book: "+super.getTitle() + " has been borrowed by " + user.getName() + ".");

    }
}

// Book (physical,ebook,...)=> abstract
// physical,ebook,... extends
// in each return new instance from the implemented 
