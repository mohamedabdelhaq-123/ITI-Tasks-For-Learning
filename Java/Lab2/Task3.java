import java.util.StringTokenizer;

public class Task3{
    public static void main(String[] args) 
	{
		boolean flag = true;
		String token;
        String ipAddress = args[0];
        StringTokenizer tokenizer = new StringTokenizer(ipAddress, ".");
      
        while (tokenizer.hasMoreTokens()) 
		{
			token=tokenizer.nextToken();
            System.out.println("IP Part: " + token);
			
            try {
                int octet = Integer.parseInt(token);
                if (octet < 0 || octet > 255) {
                    System.out.println("Invalid! Must be between 0 and 255");
                    flag = false;
                }
            } catch (NumberFormatException e) {       
                System.out.println(" Invalid! Not a number");
                flag = false;
            }
        }
		
		if(flag==true)
			System.out.println("Valid IP");
    }
}
