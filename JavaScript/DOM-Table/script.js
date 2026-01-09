do {
    var test = prompt("Enter the Number of persons");

} while (!test || isNaN(test));

var arr = [["Name", "Age"]];
var c=2;
for (var i = 1; i <= Number(test); i++) {


    do {
        var fname = prompt(`Enter Name of Person ${i}`);
        var flag = 1;
        var len=fname.length;
        for (var j = 0; j < len; j++) {
            if (isFinite(fname[j])) flag = 0;
        }

    } while (!isNaN(fname) || flag == 0 || len<=3 || len>=10);

    //arr[c++]=fname;


    do {
        var age = prompt(`Enter Age of Person ${i}`);

        age=Number(age);
    } while (!age || isNaN(age) || age <=10 || age >=60);

    //arr[c++]=age;
    arr.push([fname,age]);
}


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

document.write(table);

alert(arr);
//alert(age);