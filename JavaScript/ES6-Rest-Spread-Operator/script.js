alert("MO");



function maxmin() {  
    var args=[...arguments];  // rest
   //var arr2=[...args];
    var max=Math.max(...args);  // spread
    var min=Math.min(...args);
    return [max,min];
}
let [max,min]=maxmin(1,2,3,4,5,6,55);

alert(`Max Value: ${max} & Min Value: ${min}`);  // separated
