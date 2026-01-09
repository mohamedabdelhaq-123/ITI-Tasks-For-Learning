alert("MOOO")



do{
    var fname=prompt("Enter your Name");
    var flag=1;
    for (var i = 0; i < fname.length; i++) {
        if (isFinite(fname[i])) flag = 0;
    }

}while(!isNaN(fname) || flag==0);


do{
    var phoneNumber=prompt("Enter your phone Number");
    var test=phoneNumber.length;  // property not method

}while(isNaN(phoneNumber) || test!=8);


do{
    var mobileNumber=prompt("Enter your mobile Number");
    var test2=mobileNumber.length;
    var slice3=(mobileNumber.slice(0,3)); // 3 isn't included

}while(isNaN(mobileNumber) || test2!=11 || (slice3!="010" && slice3!="011" && slice3!="012"));


do{
    var email=prompt("Enter your email");
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

}while(!emailRegex.test(email));   //regx + >1 char , \. dot req. , {2,} at least 2 or more char
 // NOte: regex
document.write("Welcome User<br>")
document.write(fname+"<br>");
document.write(phoneNumber+"<br>");
document.write(mobileNumber+"<br>");
document.write(email);
