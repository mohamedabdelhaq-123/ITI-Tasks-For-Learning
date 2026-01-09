import java.util.function.Function;

public class Task1 {
    public static void main(String[] args) 
	{ 
        Function<Double, Double> celsiusToFahrenheit = new Function<Double, Double>()   // interface obj = new class x implements interface();
		{
			// @override
            public Double apply(Double c) 
			{
                return (c * 9.0 / 5.0) + 32.0;
            }
        };
        System.out.println(celsiusToFahrenheit.apply(25.0));
    }
}
