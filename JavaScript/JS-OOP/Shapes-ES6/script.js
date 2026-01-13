/*
2) Using ES6 new Syntax & features:
Write a script to create different shapes (rectangle, square, circle) make all of
them inherits from shape class.
a. each shape contains two functions to calculate its area and its perimeter.
b. Display the area and each object perimeter in your console by overriding
toString().
c. Create Class Property that counts numbers of created objects and
Class method to retrieve it.
d. Bonus: allow creation of only one square and one rectangle.
*/


// abstract class shape (area primeter)
// sq, rect, circle override (area,primeter,toString)  ,static counter and static method to know count


class Shape {

    constructor() {  // made const. for subclasses
        if (this.constructor === Shape) {
            throw ("error This is abstract Class");
        }
    }

    area()
    {
        console.log("Shape Area Method");
    }

    perimeter()
    {
        console.log("Shape Perimeter Method");
    }
}

class Square extends Shape{

    static counter=0; // static property to count instances

    constructor(s=2)
    {
        if(Square.counter>1)
        {
            throw("This class Instantiated Once Only");
        }
        super();  //  nice ex: You are trying to paint the walls of the second floor, but you haven't even poured the foundation yet!"
        this.side=s;
        Square.counter++; // accessed by class name can't use this
    }

    area()
    {
        return this.side*this.side;
    }

    perimeter()
    {
        return this.side*4;
    }

    toString()
    {
        return `The Area of square is ${this.area()}  & The perimeter is ${this.perimeter()}`;
    }

    static numberOfInstances()
    {
        return Square.counter;
    }
  
}


class Rectangle extends Shape {
    static counter = 0;

    constructor(w = 2, h = 2) {
        if (Rectangle.counter > 1) {
            throw("This class Instantiated Once Only");
        }
        
        super();
        this.width = w;
        this.height = h;
        Rectangle.counter++;
    }

    area() {
        return this.width * this.height;
    }

    perimeter() {
        return 2 * (this.width + this.height);
    }

    toString() {
        return `The Area of the rectangle is ${this.area()} & The perimeter is ${this.perimeter()}`;
    }

    static numberOfInstances() {
        return Rectangle.counter;
    }
}


class Circle extends Shape {
    static counter = 0;

    constructor(r = 2) {
        if (Circle.counter > 1) {
            throw("This class Instantiated Once Only");
        }

        super();
        this.radius = r;
        Circle.counter++;
    }

    area() {
        return Math.PI * Math.pow(this.radius, 2);
    }

    perimeter() {
        return 2 * Math.PI * this.radius;
    }

    toString() {
        return `The Area of the circle is ${this.area()} & The perimeter is ${this.perimeter()}`;
    }

    static numberOfInstances() {
        return Circle.counter;
    }
}

let s= new Square();
console.log(s.toString());
console.log(Square.numberOfInstances());

let r1 = new Rectangle(10, 20);
console.log(r1.toString());

let c1 = new Circle(10);
console.log(c1.toString());

// errors
let r2 = new Rectangle(5, 5);
var s2= new Square();
var s3= new Square();
