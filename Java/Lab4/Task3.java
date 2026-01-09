
class Complex<T extends Number> 
{
    private T real; //generic att
    private T imag;

    public Complex(T real, T imag)  // generic Constructor
   {
        this.real = real;
        this.imag = imag;
    }

    public T getReal() 
    {
        return real;
    }

    public T getImag()
   {
        return imag;
    }

    private double toDouble(T value)       // WHY: Because arithmetic (+ - * /) only works on primitives
    {
        return value.doubleValue();
    }

    public Complex<Double> add(Complex<T> other) 
    {

        double newReal = this.toDouble(real) + other.toDouble(other.real);
        double newImag = this.toDouble(imag) + other.toDouble(other.imag);

        return new Complex<>(newReal, newImag);
    }

    public Complex<Double> subtract(Complex<T> other) 
    {

        double newReal = this.toDouble(real) - other.toDouble(other.real);
        double newImag = this.toDouble(imag) - other.toDouble(other.imag);

        return new Complex<>(newReal, newImag);
    }

    public Complex<Double> multiply(Complex<T> other) 
    {

        double a = toDouble(real);
        double b = toDouble(imag);
        double c = toDouble(other.real);
        double d = toDouble(other.imag);

        double newReal = (a * c) - (b * d);
        double newImag = (a * d) + (b * c);

        return new Complex<>(newReal, newImag);
    }

    @Override
    public String toString() 
    {
        return real + " + " + imag + "i";
    }
}


public class Task3 {

    public static void main(String[] args) {

        Complex<Integer> c1 = new Complex<>(3, 4);   // 3 + 4i
        Complex<Integer> c2 = new Complex<>(1, 2);   // 1 + 2i

        Complex<Double> c3 = new Complex<>(2.5, 1.5); // 2.5 + 1.5i
        Complex<Double> c4 = new Complex<>(4.0, 3.0); // 4 + 3i

          // testing
        System.out.println("===== Integer Complex Numbers =====");
        System.out.println("c1 = " + c1);
        System.out.println("c2 = " + c2);

        System.out.println("Add: " + c1.add(c2));
        System.out.println("Sub: " + c1.subtract(c2));
        System.out.println("Mult: " + c1.multiply(c2));

        System.out.println("\n===== Double Complex Numbers =====");
        System.out.println("c3 = " + c3);
        System.out.println("c4 = " + c4);
        System.out.println("Add: " + c3.add(c4));
        System.out.println("Sub: " + c3.subtract(c4));
        System.out.println("Mult: " + c3.multiply(c4));
    }
}
