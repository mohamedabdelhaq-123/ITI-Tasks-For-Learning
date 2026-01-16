import javax.json.bind.*;
import java.util.*;

public class JsonbTask {
    public static void main(String[] args) {

        Jsonb jsonb = JsonbBuilder.create();

        Dog s1 = new Dog("Roy", 2);

        String seri = jsonb.toJson(s1);
        System.out.println("Serialized: " + seri);

        Dog Dog = jsonb.fromJson(seri, Dog.class);
        System.out.println("Deserialized: " + Dog);

/**************************************************************/        
        Dog[] DogArray = {
                new Dog("Tofi", 3),
                new Dog("Koko", 2)
        };

        String arrayJson = jsonb.toJson(DogArray);
        System.out.println("Serialized Array: " + arrayJson);

        Dog [] arr=jsonb.fromJson(arrayJson, Dog[].class);
         System.out.println("Deserialized Array: " +Arrays.toString(arr));

/**************************************************************/
        List<Dog> DogList = new ArrayList<>();
        DogList.add(new Dog("Tofi", 3));
        DogList.add(new Dog("Koko", 2));

        String listJson = jsonb.toJson(DogList);
        System.out.println("Serialized List: " + listJson);

        List<Dog> listBack = jsonb.fromJson(listJson, new ArrayList<Dog>() {
        }.getClass().getGenericSuperclass());
        System.out.println("Deserialized List: " + listBack);
    }
}