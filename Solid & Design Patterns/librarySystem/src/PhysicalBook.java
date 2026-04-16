public class PhysicalBook extends Book{

    public PhysicalBook(String title) {
        super(title);
    }

    @Override
    public void borrowBook(User user) {
        System.out.println("Physical Book: "+super.getTitle() + " has been borrowed by " + user.getName() + ".");

    }
}
