var arr = [["Name", "Age","Email"]];


function namevalidation(name) {
    var flag = true;
    for (var i = 0; i < name.length; i++) {
        if (isFinite(name[i])) flag = false;
    }

    return flag;
}

function agevalidation(age) {
    var flag = true;
    if (!isFinite(age)) flag = false;
    return flag;
}


function emailvalidation(mail)
{
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        //console.log(emailRegex.test(mail));
    return emailRegex.test(mail);
}

function validate(e)
{
    e.preventDefault(); // to kill auto refresh
     let mail=document.getElementById("email").value;
         let age = document.getElementById("age").value;
    let name = document.getElementById("name").value;

    if (!namevalidation(name) || !agevalidation(age) || !emailvalidation(mail)) {
        alert("Please fix the errors before submitting!");
        return false; 
    }
    arr.push([name,age,mail]);
    draw();
    return true;
}


function draw(){
var table = "<table border='10'>";

for (var i = 0; i < arr.length; i++) {

    table += "<tr>";
    
    for (var j = 0; j < arr[i].length; j++) {
        if (i === 0) {
            table += "<th>" + arr[i][j] + "</th>";   /// Name Age
        } else {
            table += "<td>" + arr[i][j] + "</td>";   // Momo 23
        }
    }
    
    table += "</tr>";
}

table += "</table>";
document.querySelector("div").innerHTML=table;
}

draw();