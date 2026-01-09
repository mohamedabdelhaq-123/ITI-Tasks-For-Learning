/*2- Ask the user to enter a message then display it using the different html
heading tags (from <h1> to <h6>) using Loops. DO NOT write the header
element explicitly in your script! */

var msg= prompt("Enter the Message");
for(var i=1;i<7;i++)
{
    document.write(`<h${i}>${msg}</h${i}>`);
}

