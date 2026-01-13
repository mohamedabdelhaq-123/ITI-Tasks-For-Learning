//alert("MO");

function myChild()
{
    var test=window.open("child.html");

    setInterval(function closeWindow(){
    test.close();
},5000);
}

