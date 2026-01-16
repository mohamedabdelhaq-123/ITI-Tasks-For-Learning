import com.google.gson.*;
import java.io.*;

public class Gsontask {
    public static void main(String[] args) {

        Gsontask tester = new Gsontask();

        try {
            Student student = new Student();

            student.setAge(25);
            student.setName("Ahmed Ali");

            tester.writeJSON(student);

            Student student1 = tester.readJSON();

            System.out.println(student1);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void writeJSON(Student student) throws IOException {

        GsonBuilder builder = new GsonBuilder();
        builder.setPrettyPrinting();
        Gson gson = builder.create();

        FileWriter writer = new FileWriter("student.json");
        writer.write(gson.toJson(student));
        writer.close();
    }

    private Student readJSON() throws FileNotFoundException {
        GsonBuilder builder = new GsonBuilder();
        Gson gson = builder.create();

        BufferedReader bufferedReader = new BufferedReader(new FileReader("student.json"));
        
        Student student = gson.fromJson(bufferedReader, Student.class);
        return student;
    }
}