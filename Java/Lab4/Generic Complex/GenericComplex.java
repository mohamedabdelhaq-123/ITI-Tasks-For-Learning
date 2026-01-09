/*Lab Exercise-2
• Create a generic class that could be used to represent complexnumbers
• Create some generic methods that represent basic arithmeti some generic methods that reprc operation on complex(addition, subtraction, etc…*/

class GenericComplex
{
    public static void main(String args[])
    {
        ComplexNumbers<Integer> c= new ComplexNumbers<>(-2,-3);
        ComplexNumbers<Double> c2= new ComplexNumbers<>(2.4,3.5);
        c.printComplexNumbers();
        c2.printComplexNumbers();
        c.addComplex(c2);
        c.subComplex(c2);
        c.multComplex(c2);
        c.divomplex(c2);
        System.out.println(c2);
    }
}


class ComplexNumbers<T extends Number>          // use Number bec contain method to convert to primitve 
{                                                // Intger is class so T can be extended
    private T realNumber;
    private T imgNumber;


    ComplexNumbers() // default constructor
    {
        
    }

    ComplexNumbers(T Real, T Img)  // generic 
    {
        this.imgNumber=Img;
        this.realNumber=Real;
    }

    // setters
    void setReal(T userReal){ this.realNumber=userReal;}
    void setImg(T userImg) { this.imgNumber=userImg;}

    // getters
    T getReal(){return this.realNumber;}
    T getImg(){return this.imgNumber;}


    void printComplexNumbers()
    {
        System.out.println("Complex is: " + this.realNumber +"+"+ this.imgNumber+"i");
    }

     @Override
    public String toString() {
        double img = imgNumber.doubleValue();
        if (img >= 0) {
            return realNumber + " + " + img + "i";
        } else {
            return realNumber + " - " + Math.abs(img) + "i";
        }
    }

    // add
    /* 
    <U extends Number> void addComplex (ComplexNumbers<U>  obj)   // generic method to add diff types of complex int and double
    {
        U newReal= this.realNumber + obj.getReal();  // since java prevent operator overloading 
                                                     // + used with primitive and strings so convert to primitive types
                                                    // 
    }*/
    

    <U extends Number> void addComplex (ComplexNumbers<U>  obj)   
    {
        double newReal= this.realNumber.doubleValue() + obj.getReal().doubleValue();  // conversion to primitive double due to generilization
        double newImg= this.imgNumber.doubleValue() + obj.getImg().doubleValue(); 
        
        if(newImg>0)
        System.out.println("Added Complex: "+ newReal +"+"+ newImg +"i");
        else
            System.out.println("Added Complex: "+ newReal + newImg +"i");
    }

    // sub 
    <U extends Number> void subComplex (ComplexNumbers<U>  obj)   
    {
        double newReal= this.realNumber.doubleValue() - obj.getReal().doubleValue();  // conversion to primitive double due to generilization
        double newImg= this.imgNumber.doubleValue() - obj.getImg().doubleValue(); 
        
        if(newImg>0)
        System.out.println("Subtracted Complex: "+ newReal +"+"+ newImg +"i");
        else
            System.out.println("Subtracted Complex: "+ newReal + newImg +"i");
    }

    // mult 
    <U extends Number> void multComplex (ComplexNumbers<U>  obj)    // wrong way to multiplicate
    {
        double newReal= this.realNumber.doubleValue() * obj.getReal().doubleValue();  // conversion to primitive double due to generilization
        double newImg= this.imgNumber.doubleValue() * obj.getImg().doubleValue(); 
        
        if(newImg>0)
        System.out.println("Multiplied Complex: "+ newReal +"+"+ newImg +"i");
        else
            System.out.println("Multiplied Complex: "+ newReal + newImg +"i");
    }

    // div
    <U extends Number> void divomplex (ComplexNumbers<U>  obj)         // wrong way to divide
    {
        double newReal= this.realNumber.doubleValue() / obj.getReal().doubleValue();  // conversion to primitive double due to generilization
        double newImg= this.imgNumber.doubleValue() / obj.getImg().doubleValue(); 
         
        if(newImg>0)
        System.out.println("Divided Complex: "+ newReal +"+"+ newImg +"i");
        else
            System.out.println("Divided Complex: "+ newReal + newImg +"i");
        
    }
}

