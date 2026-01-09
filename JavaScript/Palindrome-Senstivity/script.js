alert("MOOO")


var palindrome = prompt("Enter Text");

if (confirm("Case Senstive?")) palindrome=palindrome.toLowerCase();  // even if numbers nothing occurs
                                 // ret new string so save it 
for (var i = 0; i < palindrome.length; i++) {
    if (palindrome[i] != palindrome[palindrome.length - 1 - i]) {
        var flag = 0;
    }
}

if (flag == 0) document.write("Not Palindrome");
else document.write("Palindrome");
