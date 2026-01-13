//alert("MOO")

// 6. Alert ASCII Code of any key pressed and detect whether it is alt key or ctrl key or shift key.

// function keyAlert(e){
// console.log(e.keydown);



// }
// var p=document.querySelector("body");
// //console.log(p);
// p.addEventListener("click",keyAlert);


document.addEventListener("keydown", function (event) {
var message=" ";
   // if (event.altKey && event.key.toLowerCase() === "w") {
   if(event.altKey)
        message+= " Alt key Pressed ";
    if(event.ctrlKey)
        message+= " Ctrl key Pressed ";
    if(event.shiftKey)
        message+= " Shift key Pressed ";
    if(event.keyCode)
        message+=event.keyCode;

    console.log(message);
    //}
});