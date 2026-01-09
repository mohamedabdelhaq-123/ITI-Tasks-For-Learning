/* 
Lab Exercise-2
• Given a String, the task is to check whether a string contains only alphabets or not.
• use isLetter() method of Character class.
*/
import java.lang.*;
class alpha{

    public static void main(String[] args) {
        checker c=new checker();
        c.checkAlpha("mdomodmd");
    }

}

class checker{

    // method check all alpha or no isletter();
    void checkAlpha(String s)
    {
        int flag=0;
        // code
        for(int i=0;i<s.length();i++)
        {
            if(!Character.isLetter(s.charAt(i)))
            {
                flag=1;
            }
            
        }
        if(flag==1)
            System.out.println("all alpha");
        else
            System.out.println("not only alpha");
    }
}