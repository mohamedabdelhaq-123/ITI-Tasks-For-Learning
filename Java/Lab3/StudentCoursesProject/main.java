import java.util.Scanner;
import java.util.StringTokenizer;

public class main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        course c1 = new course("Java", 101,4);
        course c2 = new course("Math", 102, 3);
        course c3 = new course("Web", 103, 3);

        // Create the Student
        System.out.println("--- Create Student ---");
        System.out.print("Enter ID: ");
        Integer id = scanner.nextInt();
        scanner.nextLine(); // Fix the newline bug
        System.out.print("Enter Name: ");
        String name = scanner.nextLine();

        student s1 = new student(id, name);

        // Get User Input for courses
        System.out.println("\nAvailable courses: Java, Math, Web");
        System.out.println("Type course names separated by comma (ex: Java,Web)");
        String input = scanner.nextLine(); 

        // Tokenizer
        StringTokenizer st = new StringTokenizer(input, ",");

        while (st.hasMoreTokens()) 
        {
            String token = st.nextToken().trim(); // Get "Java" or "Math" or "Web"
            if (token.equalsIgnoreCase("Java")) 
            {
                s1.registerCourse(c1, 90.0); // We assume a grade of 90 for simplicity
            } 
            else if (token.equalsIgnoreCase("Math")) 
            {
                s1.registerCourse(c2, 85.5);
            } 
            else if (token.equalsIgnoreCase("Web")) 
            {
                s1.registerCourse(c3, 88.0);
            }
        }
        System.out.println("\n--- Final Report ---");  //Print the Report
        s1.printReport();
    }
}