/*5. Given a web document as shown below in Fig. a, with only these few lines of code in shown
in Fig. b. Using DOM Nodes to access, create, modify or remove any of its elements to have it
finally as shown in Fig. c.*/

var Memo = document.getElementsByTagName("ul")[0];  // ret collection
var pic = document.getElementsByTagName("img")[0];  // ret collection
console.log(pic);
var p=Memo.parentElement;
console.log(p);
p.style.cssText="float:clear";
pic.style.cssText = "float:right; width:50%";


Memo.setAttribute("type", "circle"); // not css property
Memo.style.cssText = " list-style-position: inside; padding: 10px; text-align: center";


var pic2= pic.cloneNode(true);
pic2.style.cssText = "position:fixed; bottom:0; left:0 ";

document.body.append(pic2);

