import java.util.ArrayList;
import java.util.List;

public class BestPracticen {
    public static void main(String[] args) {
        
        // Create lists for different shape types
        ArrayList<Rectangle> rectangleList = new ArrayList<>();
        ArrayList<Circle> circleList = new ArrayList<>();
        ArrayList<Shape> shapeList = new ArrayList<>();
        
        // Add rectangles
        rectangleList.add(new Rectangle());
        rectangleList.add(new Rectangle());
        
        // Add circles
        circleList.add(new Circle());
        circleList.add(new Circle());
        
        // Add mixed shapes
        shapeList.add(new Rectangle());
        shapeList.add(new Circle());
        shapeList.add(new Rectangle());
        
        // Test generic method with different lists
        ShapeDrawer drawer = new ShapeDrawer();
        
        System.out.println("=== Drawing Rectangles ===");
        drawer.drawAll(rectangleList);
        
        System.out.println("\n=== Drawing Circles ===");
        drawer.drawAll(circleList);
        
        System.out.println("\n=== Drawing Mixed Shapes ===");
        drawer.drawAll(shapeList);
    }
}


// abstract class in diff file one public class per file
// Base abstract class
abstract class Shape {    // better to be public bec if without public is package-private and for profesionalizm
    public abstract void draw();
}


// Concrete Rectangle class
class Rectangle extends Shape {
    @Override
    public void draw() {
        System.out.println("Drawing Rectangle");
    }
}

// Concrete Circle class
class Circle extends Shape {
    @Override                      // better for testing
    public void draw() {
        System.out.println("Drawing Circle");
    }
}

// Utility class with generic method
class ShapeDrawer {

    public void drawAll(List<? extends Shape> shapes) 
    {
        for (Shape shape : shapes) 
        {
            shape.draw();
        }
    }
}



/*

Summary of Best Practices

✅ Use PascalCase for class names (ShapeDrawer, not test)
✅ Use descriptive method names (drawAll(), not genericTestMethod())
✅ Use descriptive variable names (drawer, not t)
✅ Add multiple items to test collections properly
✅ Use @Override annotation for clarity and safety
✅ Specify access modifiers explicitly (public, private)
✅ Your wildcard choice is correct! (? extends Shape for read-only)
✅ Format output clearly with separators





// ✅ BEST: Flexible for reading
//void process(List<? extends Shape> list) { /* read only  }

// ✅ GOOD: When you need to read AND write
//void modify(List<Shape> list) { /* read and write }   ===> accept shapes only not subclasses

// ❌ AVOID: No type safety, legacy code
//void legacy(List list) { /* dangerous! }  ==> Can add ANY type of object
*/

/*
List list = new ArrayList();  // Raw type

// Can add ANYTHING - no type checking
list.add("Hello");
list.add(123);
list.add(new Circle());

// Retrieving requires casting - RISKY!
String s = (String) list.get(0);  // ✅ Works
String x = (String) list.get(1);  // ❌ ClassCastException at RUNTIME!
*/