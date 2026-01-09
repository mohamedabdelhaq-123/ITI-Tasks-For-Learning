class BestPractice {
    public static void main(String[] args) {
        Account account = new Account();
        
        try {
            account.setAge(25);
            System.out.println("Age set successfully");
        } catch (InvalidValueException e) {
            System.out.println("Error: " + e.getMessage());
        }
        
        try {
            account.setId(100);
            System.out.println("ID set successfully");
        } catch (InvalidValueException e) {
            System.out.println("Error: " + e.getMessage());   // get the meaningful message stored in my super that fits this error
        }
        
        try {
            account.setBalance(-50);
            System.out.println("Balance set successfully");
        } catch (InvalidValueException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
 
class Account {                          // meaningful names + clases PascalCase
    private int age;
    private int id;                                         // methods and variables camelCase
    private int balance;
    
    public void setAge(int age) throws InvalidValueException {
        if (age < 21) {
            throw new InvalidValueException("Age must be at least 21, provided: " + age);  // throw meaningful exception
        }
        this.age = age;
    }
    
    public void setId(int id) throws InvalidValueException {
        if (id < 0) {
            throw new InvalidValueException("ID cannot be negative, provided: " + id);
        }
        this.id = id;
    }
    
    public void setBalance(int balance) throws InvalidValueException {
        if (balance < 0) {
            throw new InvalidValueException("Balance cannot be negative, provided: " + balance);
        }
        this.balance = balance;
    }


    public int getAge() { return age; }                    // getters for the completeness
    public int getId() { return id; }
    public int getBalance() { return balance; }
}

class InvalidValueException extends Exception {
    public InvalidValueException(String message) {     // to throw meaningful excep. so need const. that take string
        super(message); 
    }
}


/*
super(message) = Call the parent class (Exception) constructor and pass the message to it

Object
  └── Throwable
       └── Exception  ← Your custom exception extends this
            └── InvalidValueException

The parent class stores the message in an internal field
getMessage() retrieves that stored message
Why it matters: Your exception object becomes a data carrier with context about the error, not just a signal that something went wrong */


/*
## Visual Flow of How Message is Delivered
```
1. throw new InvalidValueException("Age must be at least 21")
                    ↓
2. InvalidValueException constructor receives: "Age must be at least 21"
                    ↓
3. super("Age must be at least 21") calls Exception's constructor
                    ↓
4. Exception class stores the message internally in a field
                    ↓
5. catch (InvalidValueException e) catches the exception object
                    ↓
6. e.getMessage() retrieves the stored message
                    ↓
7. Output: "Age must be at least 21"
*/


/*
=======================More Details about message flow=====================

### The Call Chain:
```
Step 1: new InvalidValueException("Age must be at least 21")
            ↓
Step 2: InvalidValueException constructor receives "Age must be at least 21"
            ↓
Step 3: super("Age must be at least 21")
        Calls Exception's constructor
            ↓
Step 4: Exception's constructor: super("Age must be at least 21")
        Calls Throwable's constructor
            ↓
Step 5: Throwable's constructor:
        this.detailMessage = "Age must be at least 21"
        ← MESSAGE STORED IN THIS PRIVATE FIELD!
*/

/*
Summary of Key Best Practices

✅ Meaningful exception names (InvalidValueException not myExceptionClass)
✅ Add constructors to pass messages to exceptions
✅ Use descriptive variable names (e instead of varThatContainErrorData)
✅ Print exception messages from the exception object
✅ Only use finally for cleanup (resource management)
✅ Follow Java naming conventions (PascalCase for classes, camelCase for methods/variables)
*/