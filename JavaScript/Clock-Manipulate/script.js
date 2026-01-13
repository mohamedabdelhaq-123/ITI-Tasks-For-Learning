alert("MO");
/*

3. Create a new page that has a button (Start clock), that showing alert saying “Clock Started”
and displays clock with current time in local format (time only without date) in a div updated
every second.
b. Stop the clock when user clicks (alt + w) letter, and show alert saying “Clock stopped”.*/

var test;

function startClock(){

alert("Clock Started");

    
    
test= setInterval(everySecUpdate,1000);

}


function everySecUpdate()
{
    var date = new Date();
    document.querySelector("div").textContent=date.toLocaleTimeString();

}


document.addEventListener("keydown", function (event) {
    if (event.altKey && event.key.toLowerCase() === "w") {
        clearInterval(test);
        alert("Clock stopped");
    }
});