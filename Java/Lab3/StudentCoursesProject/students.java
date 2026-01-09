import java.util.ArrayList;  // to use ArrayList
import java.util.StringTokenizer;
import java.lang.StringBuilder; // to use StringBuilder

class student implements studentInterfaces
{
	// Attributes
	private Integer studentId;
	private String name;
	// ArrayList stores CourseRegistration objects (inner class instances) for all courses this student is registered in
	// Each CourseRegistration holds a course reference and the grade the student received in that course
	ArrayList<CourseRegistration> registrations = new ArrayList<>();
	// constructor
	public student(Integer studentId, String name)
	{
		this.studentId = studentId;
		this.name = name;	
		this.registrations = new ArrayList<>(); // Initialize the empty list
	}

	// Methods
	public void printReport() // stringbuilder
	{
		// to be implemented
		// make obj 
		StringBuilder obj = new StringBuilder();
		// append general info of student 
		obj.append("Stundent ID is: " + this.name+"\n");
		obj.append("Stundent Name is: " + this.studentId+"\n");
		// loop to append courses and grades
		for(int i=0; i< registrations.size(); i++)
		{
			obj.append("Course Name: " + registrations.get(i).getRegisteredCourse().getCourseName() + "\n");
			obj.append("Grade: " + registrations.get(i).getregisteredCourseGrade() + "\n");
		}
		System.out.println(obj.toString()); // print the report use toString() method of StringBuilder to convert to string 
	}	

	  // Register a single course
	public void registerCourse(course course, Double grade)
	{
		CourseRegistration cr = new CourseRegistration(course, grade);
		registrations.add(cr);
	}

	// getters
	public Integer getStudentId()
	{
		return this.studentId;
	}
	public String getStudentName()
	{
		return this.name;
	}
	// inner class to hold course registration info
	

		// Inner class - must be declared before use
	private class CourseRegistration
	{    // attributes
		private course registerCourse;
		private Double registeredCourseGrade;

		// constructor
		public CourseRegistration(course registerCourse, Double registeredCourseGrade)
		{
			this.registerCourse = registerCourse;
			this.registeredCourseGrade = registeredCourseGrade;
		}

		// getters
		public course getRegisteredCourse()
		{
			return this.registerCourse;
		}

		public Double getregisteredCourseGrade()
		{
			return this.registeredCourseGrade;
		}

	}


}
