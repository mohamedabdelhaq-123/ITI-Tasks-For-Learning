alert("MOOO")

var arr = [];
for (var i = 0; i < 5; i++) {

    do {
        var test = prompt("Enter the Number");

    } while (!test || isNaN(test));
    arr[i] = Number(test);

}
function mySort(sec,first){
   // console.log(arguments);

return first-sec;  // for desc comp. btw first and sec. if first>> , so swap 

 /* for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr.length - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;*/
}

document.write(`Entered Values: ${arr.join(',')}<br>`);
document.write(`Sorted Descending Values: ${arr.sort(mySort).join(',')}<br>`);
document.write(`Sorted Ascending  Values: ${arr.reverse().join(',')}<br>`);