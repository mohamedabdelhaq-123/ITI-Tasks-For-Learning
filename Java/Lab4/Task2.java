import java.util.ArrayList;   // Needed for ArrayList and List
import java.util.List;

abstract class Shape {
    public abstract void draw(); // Every child class MUST implement this method
}

class Rectangle extends Shape 
{
    @Override      // to let compiler check that method is overridden
    public void draw() 
    {
        System.out.println("Rectangle shape");
    }
}

class Circle extends Shape 
{
    @Override     
    public void draw() 
    {
        System.out.println("Circle shape");
    }
}


public class Task2 
{
    public static void drawShapes(List<? extends Shape> shapes)   // Generic method that accepts ONLY child classes of Shape or shape
    {                                            
        for (Shape s : shapes) // Loop through the list and call each element's draw() method
        {
            s.draw();
        }
    }
    public static void main(String[] args) 
    {
        ArrayList<Rectangle> rectangleList = new ArrayList<>();  // Create a list of Rectangle objects
        rectangleList.add(new Rectangle());

        ArrayList<Shape> shapeList = new ArrayList<>();   // Create a list of Shape objects 
        shapeList.add(new Rectangle());
        shapeList.add(new Circle());

        System.out.println("Passing Rectangle list:");
        drawShapes(rectangleList);   // Works because Rectangle is a child of Shape

        System.out.println("\nPassing Shape list:");
        drawShapes(shapeList);       // Works because list is already of Shape
    }
}
