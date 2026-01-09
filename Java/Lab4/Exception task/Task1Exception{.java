class Task1Exception{   
    /* the second class will be calling the methods that throws exception using the try-catch-finally block.*/
    public static void main(String args[])
    {
        otherClass1 obj1 = new otherClass1(); // obj of ...
        // obj1.setAge(299);  this function may occur error so  must be caught or declared to be thrown so put bet try and catch
        try{
            obj1.setAge(9); 
        } 
        catch(myExceptionClass varThatContainErrorData) // the error im trying to catch
        {
            // handling or propagate
          System.out.println("Wrong Age");
        }

        try{
            obj1.setId(-7); 
        } 
        catch(myExceptionClass varThatContainErrorData) // the error im trying to catch
        {
            // handling or propagate
          System.out.println("Wrong id");
        }


        try{
            obj1.setBalance(-9); 
        } 
        catch(myExceptionClass varThatContainErrorData) // the error im trying to catch
        {
            // handling or propagate
          System.out.println("Wrong balance");
        }
        finally{                                          // always executed 
             System.out.println("momo");
        }

       
    }
}


/*the first will contain three methods throwing your newly created exception class */
class otherClass1{
// method 1 error occurs age
// mehtod 2  id
// method 3 balance
    private int age;
    private int id;
    private int balance;

    void setAge(int age) throws myExceptionClass  // function that throws this error
    {
        if(age<21)
            throw new myExceptionClass(); // error
        this.age=age;
    }

    void setId(int id) throws myExceptionClass
    {
        if(id<0)
            throw new myExceptionClass();//error
        this.id=id;
    }

    void setBalance(int bal) throws myExceptionClass
    {
        if(bal<0)
            throw new myExceptionClass();// error
        this.balance=bal;
    }



}



class myExceptionClass extends Exception {   // since checked exception, therfore: handle it (try-catch) or use throws in methods.
  
    myExceptionClass()   // default constructor
    {

    }

}