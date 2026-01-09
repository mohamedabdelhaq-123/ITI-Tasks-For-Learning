class BestPractice {
    public static void main(String args[]) {
        ComplexNumber<Integer> c1 = new ComplexNumber<>(-2, -3);
        ComplexNumber<Double> c2 = new ComplexNumber<>(0.0, 0.0);
        
        System.out.println("c1: " + c1);
        System.out.println("c2: " + c2);
        
        ComplexNumber<Double> sum = c1.add(c2);
        ComplexNumber<Double> diff = c1.subtract(c2);
        ComplexNumber<Double> product = c1.multiply(c2);
        try{ 
            ComplexNumber<Double> quotient = c1.divide(c2);
            System.out.println("Quotient: " + quotient);
        }
        catch(ArithmeticException e)
        {
            System.out.println("Exception Error: "+e.getMessage());
        }
        
        System.out.println("Sum: " + sum);
        System.out.println("Difference: " + diff);
        System.out.println("Product: " + product);
        
    }
}

class ComplexNumber<T extends Number> {
    private T real;
    private T imaginary;
    
    // Constructors
    public ComplexNumber() {
       // this(0, 0);  // Delegate to parameterized constructor with default values
    }
    
    public ComplexNumber(T real, T imaginary) {
        this.real = real;
        this.imaginary = imaginary;
    }
    
    // Getters
    public T getReal() { return real; }
    public T getImaginary() { return imaginary; }
    
    // Setters
    public void setReal(T real) { this.real = real; }
    public void setImaginary(T imaginary) { this.imaginary = imaginary; }
    
    // Addition: (a + bi) + (c + di) = (a+c) + (b+d)i
    public <U extends Number> ComplexNumber<Double> add(ComplexNumber<U> other) {
        double newReal = this.real.doubleValue() + other.getReal().doubleValue();
        double newImg = this.imaginary.doubleValue() + other.getImaginary().doubleValue();
        return new ComplexNumber<>(newReal, newImg);
    }
    
    // Subtraction: (a + bi) - (c + di) = (a-c) + (b-d)i
    public <U extends Number> ComplexNumber<Double> subtract(ComplexNumber<U> other) {
        double newReal = this.real.doubleValue() - other.getReal().doubleValue();
        double newImg = this.imaginary.doubleValue() - other.getImaginary().doubleValue();
        return new ComplexNumber<>(newReal, newImg);
    }
    
    // Multiplication: (a + bi) × (c + di) = (ac - bd) + (ad + bc)i
    public <U extends Number> ComplexNumber<Double> multiply(ComplexNumber<U> other) {
        double a = this.real.doubleValue();
        double b = this.imaginary.doubleValue();
        double c = other.getReal().doubleValue();
        double d = other.getImaginary().doubleValue();
        
        double newReal = (a * c) - (b * d);
        double newImg = (a * d) + (b * c);
        
        return new ComplexNumber<>(newReal, newImg);
    }
    
    // Division: (a + bi) ÷ (c + di) = [(ac + bd) / (c² + d²)] + [(bc - ad) / (c² + d²)]i
    public <U extends Number> ComplexNumber<Double> divide(ComplexNumber<U> other) throws ArithmeticException
    {
        double a = this.real.doubleValue();
        double b = this.imaginary.doubleValue();
        double c = other.getReal().doubleValue();
        double d = other.getImaginary().doubleValue();
        
        double denominator = (c * c) + (d * d);
        
        if (denominator == 0) {
            throw new ArithmeticException("Cannot divide by zero complex number");
        }
        
        double newReal = ((a * c) + (b * d)) / denominator;
        double newImg = ((b * c) - (a * d)) / denominator;
        
        return new ComplexNumber<>(newReal, newImg);
    }
    
    // Better toString method instead of separate print method
    // @Override
    // public String toString() {
    //     double img = imaginary.doubleValue();
    //     if (img >= 0) {
    //         return real + " + " + img + "i";
    //     } else {
    //         return real + " - " + Math.abs(img) + "i";
    //     }
    // }
}