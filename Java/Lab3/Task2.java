import java.util.function.Function;

public class Task2 {
    public static void main(String[] args) 
	{

        Function<double[], Integer> quadraticFunc = new Function<double[], Integer>() 
		{
          //  @override
            public Integer apply(double[] coeffs) 
			{
                double firstRoot = 0, secondRoot = 0, realRoot = 0, realPart = 0, imgPart = 0, underRoot = 0;
                double a = coeffs[0];
                double b = coeffs[1];
                double c = coeffs[2];
                underRoot = (b * b) - (4 * a * c);

                if (underRoot > 0) 
				{
                    firstRoot = (-b + Math.sqrt(underRoot)) / (2 * a);
                    secondRoot = (-b - Math.sqrt(underRoot)) / (2 * a);
                    System.out.println("Two real roots ===> x1 = " + firstRoot + ", x2 = " + secondRoot);
                    return 0;
                } 
				else if (underRoot == 0) 
				{
                    realRoot = -b / (2 * a);
                    System.out.println("One real double root ===> x = " + realRoot);
                    return 0;
                } 
				else 
				{
                    realPart = -b / (2 * a);
                    imgPart = Math.sqrt(-underRoot) / (2 * a);
                    System.out.println("Two complex roots ===> " + realPart + " + " + imgPart + "i , " + realPart + " - " + imgPart + "i");
                    return 0;
                }
            }
        };

        double[] coeffs = {1, 3, "vvv"};  // Input

        quadraticFunc.apply(coeffs);  // func call
    }
}
