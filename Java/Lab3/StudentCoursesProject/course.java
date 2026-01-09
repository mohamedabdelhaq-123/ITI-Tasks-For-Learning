public class course
{
    // attributes
    private String courseName;         // Collections like ArrayList work only with objects, not primitives.
    private Integer courseId;
    private Integer creditHours;


    // constructor
    public course(String courseName,Integer courseId, Integer creditHours)   // need some validation 
    {
        this.courseName = courseName;                                       // this keyword "refers" to the current object
        this.courseId = courseId;
        this.creditHours = creditHours;
    }
    //Methods
    public Integer getCourseId() {
        return courseId;
    }
    public String getCourseName() {
        return courseName;
    }
    public int getCreditHours() {
        return creditHours;
    }
    public static void main(String[] args) 
	{
        course c1= new course("OOP", 101, 3);
        System.out.println("Course created successfully!");
        System.out.println("ID: " + c1.getCourseId());
        System.out.println("Name: " + c1.getCourseName());
        System.out.println("Hours: " + c1.getCreditHours());
    }
}

