package DEMO_JSON;

import jakarta.json.*;
import java.io.*;

public class jsontask {
    public static void main(String args[]) {
        // System.out.println("MOO");
        try {
            JsonReader reader = Json.createReader(new FileInputStream("Library-JSON/library.json"));

            JsonObject lib = reader.readObject();

            String id = lib.getString("LibraryID");
            String loc = lib.getString("Location");

            JsonArray books = lib.getJsonArray("Books");

            System.out.println(id);
            System.out.println(loc);
            System.out.println(books);

            reader.close();

        } catch (Exception e) {
            // TODO: handle exception
            System.out.println("ERROR");

        }

        JsonObject Student = Json.createObjectBuilder() // normal obj
                .add("Name", "MO")
                .add("Age", 23)
                .add("Number", Json.createArrayBuilder() // array obj in normal obj
                        .add(Json.createObjectBuilder()
                                .add("Company", "Vodafone")
                                .add("Number", "01000539560")))

                .build();

        try {

            JsonWriter writer = Json.createWriter(new FileWriter("DEMO_JSON/student.json"));

            writer.writeObject(Student);

            writer.close();
        } catch (Exception e) {
            // TODO: handle exception
            System.out.println("ERROR in Writer");
        }

    }
}
