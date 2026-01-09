// console.log("moooooooo")

/*
3- Write a script that takes from the user n values and returns their sum, stop
receiving values from user when he enters 0 or sum exceeds 100, check that
the entered data is numeric and inform the user with the total sum of the
entered values.
*/

var sum=0;
do
{
    do{
        var test=prompt("Enter the Number");

    }while(!test || isNaN(test));

    sum+=Number(test);

}while(test!=0 && sum<=100);

alert("Your Summed Inputs are: "+sum);