alert("MOOO")

/*
1- Create a function that accepts only 2 parameters and throw exception if
number of parameters either less than or exceeds 2 parameters


2- Write a function that takes any number of parameters and returns them
reversed using array’s reverse function.


3- Write your own function that can add n values ensure that all passing
parameters are numerical values only


4- Make a function that takes date string as a parameter, and returns the Day
name (Saturday, Sunday,…) of the given date.
*/


function twoParamtersOnly() {
    if (arguments.length != 2)
        throw ("Not 2 Parameters");
    else
        alert("OK");
}

twoParamtersOnly(1, 2);
//twoParamtersOnly(1, 2, 3);

/****************************************************************************** */

function arrayReverse() {
    var arr = [];
    for (var i = 0; i < arguments.length; i++) {
        //arr[i] = arguments[arguments.length - 1 - i]
        arr.unshift(arguments[i]);
    }
    return arr;
}

//
alert(arrayReverse(1, 2, 3, "moo"));

/***************************************************************************** */

function addValues() {

    for (var i = 0; i < arguments.length; i++) {
        if (!isFinite(arguments[i])) var flag = 0;
    }

    if (flag != 0) {
        var sum = 0;
        for (var i = 0; i < arguments.length; i++)
            sum += arguments[i];
    }
    else alert("Not all Values are Numbers");

    return sum;
}

alert(addValues(1, 2, 3, 4, 5, 6));
alert(addValues(1, 2, 3, 4, "M", 6));

/******************************************************************************* */

function dayName(date) //==> string MM/DD/YYYY   
{
    var d = new Date(date);  
    var x = d.getDay();
    if (x == 0) return "Sunday";
    else if (x == 1) return "Monday";
    else if (x == 2) return "Tuesday";
    else if (x == 3) return "Wednesday";
    else if (x == 4) return "Thursday";
    else if (x == 5) return "Friday";
    else if (x == 6) return "Saturday";

    else // message
    {
        throw("Error");
    }
 
}

alert(dayName("1/4/2026"));
alert(dayName("mo"));

/******************************************************************************* */
