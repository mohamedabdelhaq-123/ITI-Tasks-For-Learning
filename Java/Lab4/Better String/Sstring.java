/*
Lab Exercise-1
• Your goal is to make a method called betterString that takes 
two Strings and a lambda that says whether the first of the two
is “better”.
• The method should return that better String; i.e., if the
function given by the lambda returns true, the betterString
method should return the first String, otherwise betterString
should return the second String.
• String string1 = ...;
• String string2 = ...;
• String longer = StringUtils.betterString(string1, string2, (s1, s2) -> s1.length() > s2.length());
• String first = StringUtils.betterString(string1, string2, (s1, s2) -> true);
*/

class Sstring {
    public static void main(String args[])
    {
        choose c =new choose();
        c.betterString("momo", "ziaaad", (a,b)-> a.length() > b.length());
    }
}


interface  exp 
{
    boolean cmp(String s1,String s2);
}

class choose{

  void betterString(String s1, String s2, exp cmpfunc)
  {
        if(cmpfunc.cmp(s1, s2)==true)
            System.out.println(s1);                    // method(s1,s2,(lambda exp)==> bool)
        else                                             // bool ture==> first else second
            System.out.println(s2);
                                        
        
  }

}