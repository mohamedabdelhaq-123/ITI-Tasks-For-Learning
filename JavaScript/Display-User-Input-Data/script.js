/*
- On contact page prompt user to enter his name, make sure that name is string,
and let the user enter his birth year and make sure that it is a number, and it is
less than 2010, and then calculate his age. For each prompt if user input valid
show him next prompt, if not valid show him the same prompt again until user
enters it correctly (use loops). And after validating user input, write all user
input on the page in that format:
Name: ahmed
Birth year: 1981
Age: 30
*/

// alert("moooooooo")

do{
    var fname=prompt("Enter your Name");

}while(isFinite(fname));

do{
    var birhtyear=prompt("Enter your Birth Year");

}while((!birhtyear || isNaN(birhtyear)) || Number(birhtyear)>2010 );

do{
    var age=prompt("Enter your Age");

}while(!age || isNaN(age));




document.write("<u><b>Name:</b></u> " + fname+"<br>");
document.write("<u><b>Birth year:</b></u> " + birhtyear+"<br>");
document.write("<u><b>Age:</b></u> " + age+"<br>");