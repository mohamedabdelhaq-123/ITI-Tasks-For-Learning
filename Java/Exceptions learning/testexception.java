

public class testexception {
    public static void main(String args[])
    {
        //int x=9;
        int arr[]=new int[2];
        //int arr2[]=null;
        try{
            arr[3]=9;
        }
        catch(ArrayIndexOutOfBoundsException e)
        { 

            arr[1]=9;                                          // handling 
            System.out.println("array index is out of bound");  // just to avoid program crash
        } 
        
        try
        {
            String s=null;
            System.out.print(s.charAt(0));  // try to access char in string which is null
        }
        catch(NullPointerException e)
        {
            System.out.println("nullllll");   // can't be handled just go back to code and handle error
        }
    }  

}
