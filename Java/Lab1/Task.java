import java.util.Random;
import java.util.Arrays;

class Task{

	public static void main(String args[])
	{
		int arr[]=new int [1000];
		Random randomNumbers = new Random();
		for(int i=0;i<1000;i++)
		{
			arr[i]=randomNumbers.nextInt(2000);
		}
		
		int max=arr[0], min=arr[0];
		
		long startTimeBeforeLoop= System.nanoTime(); // Output is a long number (milliseconds since 1970). and nanoTime() is more precise 
		for(short i=0;i<1000;i++)
		{
			if(arr[i]>max)
			max=arr[i];
			
			if(arr[i]<min)
			min=arr[i];
		}
		long timeAfterLoop= System.nanoTime();
		
		System.out.println("Before Sorting");
		System.out.println("Max Value is: "+max+" "+"Min Value is: "+min);
		System.out.println("Time Taken in Loop is:  "+(timeAfterLoop-startTimeBeforeLoop));
		//System.out.println(min);
		
		/********************************************/
		
		Arrays.sort(arr);
	        startTimeBeforeLoop= System.nanoTime();
		

		binarySearch(arr,1000,4);

		timeAfterLoop= System.nanoTime();
		
		System.out.println("After Sorting");
		System.out.println("Max Value is: "+max+" "+"Min Value is: "+min);
		System.out.println("Time Taken in Loop is:  "+(timeAfterLoop-startTimeBeforeLoop));
		//System.out.println(min);
		//System.out.println("Hello Ziad");
		
		

	}
	

		 public static int binarySearch(int arr[], int size, int target) 
		{
			int left = 0;
			int right = 999;

			while (left <= right) 
			{
				int mid = left + (right - left) / 2; 
					if (arr[mid] == target)
		 			   return mid; 
					else if (arr[mid] < target)
					    left = mid + 1;
					else
		 			   right = mid - 1;
			}
				return -1; 
		}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
