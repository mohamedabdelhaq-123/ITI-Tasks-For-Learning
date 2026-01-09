
class Task2{

	public static void main(String args[])
	{
		System.out.println("Hello, I'm Abdelhaq");
		if(args.length==0)
		System.out.println("No Arguments Provided");
		else if(args.length>2 ) 
		{
			for(int i=0;i<args.length;i++)
			{
			System.out.println(args[i]);
			}
		}
		else
		{
			for(int i=0;i<Integer.parseInt(args[0]);i++)
			{
			System.out.println(args[1]);
			}
		}
		
	}
}
