alert("MOOO")

var arr = [];
var sum = 0, mul = 1, div = 1;
for (var i = 0; i < 3; i++) {

    do {
        var test = prompt("Enter the Number");

    } while (!test || isNaN(test));
    arr[i] = Number(test);
    sum += arr[i];
    mul *= arr[i];
    if (i == 0)
        div = arr[i];
    else
        div /= arr[i];

}

document.write(`Sum of The 3 Values: ${arr.join('+')}=  ${sum} <br>`);
document.write(`Multiplication of The 3 Values: ${arr.join('*')}=  ${mul}<br>`);
document.write(`Division of The 3 Values: ${arr.join('/')}=  ${div}<br>`);

