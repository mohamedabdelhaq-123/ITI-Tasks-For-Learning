public class Task3regex {
    public static void main(String[] args) {

        String ip = args[0];

        
        String ipv4Regex =
                "^((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}"  // ^ start of string, $ end of string
                + "(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)$"; // 25[0-5] → Matches 250–255, 2[0-4]\d → Matches 200–249, 1\d\d → Matches 100–199
                                                             // [1-9]?\d → Matches 0–99, \d alone → 0–9, ? => optional first digit
        if (ip.matches(ipv4Regex)) 
	{
            System.out.println ("Valid IP");
        } 
	else 
	{
            System.out.println("Invalid IP");
        }
    }
}
