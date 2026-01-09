/*import java.util.ArrayList;
import java.util.List;

public class GenericDraw {
    public static void main(String args[])
    {
        // code
        System.out.println("mooooooooooooo");

        ArrayList<Rectangle> arrlist = new ArrayList<Rectangle>();   // old way before jdk 6
        ArrayList<Circle> arr2list = new ArrayList<>();              // new way
        ArrayList<Shape> shapeList = new ArrayList<>();

        Rectangle r=new Rectangle();
        arrlist.add(r);
        //r.draw();

        Circle c=new Circle();
        arr2list.add(c);
        //c.draw();

        test t=new test();
        t.genericTestMethod(arr2list);
        t.genericTestMethod(shapeList);
        t.genericTestMethod(arrlist);
        
    }

}


abstract class Shape{                // base class "abstract"

    abstract void draw();
}


class Rectangle extends Shape
{
    void draw()
    {
        System.out.println("Rectangle Drawing");
    }
}


class Circle extends Shape{

    void draw()
    {
        System.out.println("Circle Drawing");
    }
}

class test{
                                // ex: String list
    void genericTestMethod(List <? extends Shape> list)     // "Upper Bound" list accepts a list that contains shape and its subclasses
    {                                                      //  "Lower Bound"==>(List <? super Shape> list)==> accept shape and parent classes
        for(Shape value: list)
        {
            value.draw();
        }
    }
}


/*
Lab Exercise-1
• Create a base class named Shape that contains one abstract method draw().
• Create two concrete classes (Rectangle and Circle) that extend Shape
• Create a test class that defines a method that accepts a list that contains only child classes of shape
• Test your method by creating two ArrayList of Rectangle and shapes and pass them to the generic method
*/