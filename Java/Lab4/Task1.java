
class MyCustomException extends Exception    // This defines a new exception 
{           // since checked exception, therfore: handle it (try-catch) or use throws in methods.
    public MyCustomException(String message)  // Constructor
    {
        super(message); // pass the message to parent to save message 
    }
}

// Class with methods that throw the custom exception
class ExceptionMethods 
{
    // Method 1
    public void checkNumber(int number) throws MyCustomException   // caller must handle
    {
        if (number < 0) 
        {
            throw new MyCustomException("Number cannot be negative!");
        } 
        else 
        {
            System.out.println("Number is valid: " + number);
        }
    }

    // Method 2
    public void checkAge(int age) throws MyCustomException 
    {
        if (age < 18) 
        {
            throw new MyCustomException("Age must be at least 18!");
        } 
        else 
        {
            System.out.println("Age is valid: " + age);
        }
    }

    // Method 3
    public void checkBalance(double balance) throws MyCustomException 
    {
        if (balance < 100) 
        {
            throw new MyCustomException("Balance must be at least 100!");
        } 
        else 
        {
            System.out.println("Balance is sufficient: " + balance);
        }
    }
}


public class Task1          // Class that handles the exceptions using try-catch-finally
{
    public static void main(String[] args) 
    {
        ExceptionMethods em = new ExceptionMethods();
        // handle 1
        try {
            em.checkNumber(-5);
        } catch (MyCustomException e) {
            System.out.println("Caught Exception: " + e.getMessage());
        } finally {
            System.out.println("Finished checking number.\n");
        }

        // handle 2
        try {
            em.checkAge(16);
        } catch (MyCustomException e) {
            System.out.println("Caught Exception: " + e.getMessage());
        } finally {
            System.out.println("Finished checking age.\n");
        }

        // handle 3
        try {
            em.checkBalance(50);
        } catch (MyCustomException e) {
            System.out.println("Caught Exception: " + e.getMessage());
        } finally {
            System.out.println("Finished checking balance.\n");
        }
    }
}
