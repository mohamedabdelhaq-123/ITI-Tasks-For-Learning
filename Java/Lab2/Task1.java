public class Task1 {
    public static void main(String[] args) {
        int counterForWords=0;
        String sentenceNeededForSplitting ="ITI develops people and ITI house of developers and ITI fo people";
        String wordToSplit = "ITI";

		String[] parts = sentenceNeededForSplitting.split(wordToSplit);
        counterForWords = parts.length-1;
        System.out.println("Way 1 By Split :"+ wordToSplit + " appeared " + counterForWords);
	
        counterForWords=0;
		int foundPosition=0;
		for(; ;) 
		{
			foundPosition = sentenceNeededForSplitting.indexOf(wordToSplit, foundPosition);  // loops in sentence until find word ret index
			//System.out.println(foundPosition);
			if (foundPosition != -1)
			{
				counterForWords++;
				foundPosition++; 
			}
			else 
			{
				break; 
			}
			//System.out.println(index);
			
		}
        System.out.println("Way 2 By indexof :"+ wordToSplit + " appeared " + counterForWords);
        
    }
    

}

