// console.log("MOOMMOO");

// need to create a file
// get whole
// if cmd is add inc global id by 1
// in json by default {id:ID,item:"Laptop",quantity: 1, category:"General"}
// concat on json with new json


import { error } from 'console';
import fs from 'fs'; // used to read file



// path.join let valid reduce


// console.log(fs.readFileSync("./inventory.json")) // gets file as buffer format <Buffer 4e 49>
// console.log(fs.readFileSync("inventory.json","utf-8")); // gets file as string format

// console.log(fs.existsSync("inventory.json")) // to check if file exists or no
if (!fs.existsSync("inventory.json")) {
    fs.writeFileSync("inventory.json");
    console.log(fs.readFileSync("inventory.json", "utf-8"));
}

// console.log(process.argv); // show the whole command in shell
const [, , command, value,nextarg] = process.argv;  //to extract word add (command) ,, Laptop (value)


let myFile;
try {
     myFile = JSON.parse(fs.readFileSync("inventory.json", "utf-8")); // convert to js objects

     myFile=myFile.filter((item)=>item !==null);
} catch (error) {
    myFile = [];
}


if (command === "add") {
    let newId = myFile.length + 1;
    let data = { id: newId, item: value, quantity: 1, category: "General" };
    // fs.writeFileSync("inventory.json",globalId.toString()); // but write overwrights

    let newDataFile = myFile.concat(data);
    // console.log(newDataFile);

    fs.writeFileSync("inventory.json", JSON.stringify(newDataFile));

}

else if (command === "restock") {
    
    let itemRestock= myFile.find((item)=> item.id === Number(value));

    itemRestock.quantity+=Number(nextarg);
    fs.writeFileSync("inventory.json", JSON.stringify(myFile));
}

else if (command === "destock") {
    
    let itemDestock= myFile.find((item)=> item.id === Number(value));

    itemDestock.quantity-=Number(nextarg);
    if(itemDestock.quantity<0)
        itemDestock.quantity=0;
    fs.writeFileSync("inventory.json", JSON.stringify(myFile));
}

else if (command === "edit") {
    
    let itemEdit= myFile.find((item)=> item.id === Number(value));

    itemEdit.item=nextarg;

    fs.writeFileSync("inventory.json", JSON.stringify(myFile));
}

else if (command === "delete") {
    
    let newMyFile= myFile.map(   // another method
        (item)=> {
        if(item.id !== Number(value))
            return item;
    });


    console.log(newMyFile);
    fs.writeFileSync("inventory.json", JSON.stringify(newMyFile));
}

else if(command==="list")
{
    let newMyFile= myFile.filter((item)=>item!==null).map(
        (item)=> {
            console.log( item);
            // if( item=== null)
            //     return ;
            let str= `
            ID: ${item.id} 
            Item: ${item.item}
            Quantity: ${item.quantity}
            Category: ${item.category}
        `;
        if(item.quantity > 2)
            return str.concat(`    Status: Available`);
  
        else if(item.quantity===1)
            return str.concat(`    Status: Low Stock`);
        else if(item.quantity ===0)
            return str.concat(`    Status: Out of Stock`);

        });
    console.log(newMyFile.join('\n--------------------------------\n'));
}

else if(command==="summary")
{
    // let available=0,low=0,outOfStock=0;
    let newMyFile=myFile.filter((item)=>item !==null)
    let str= 
    `Total Number of Items: ${newMyFile.length}
Total quantity of all items: ${newMyFile.reduce((total,curr)=>{
            return total+curr.quantity;
     },0)}
Total Available : ${newMyFile.reduce((total,item)=>{
    if(item.quantity>2) return total+item.quantity;
    else return total;
},0)}
Total Low of Stock : ${newMyFile.reduce((total,item)=>{
    if(item.quantity===1) return total+item.quantity;
    else return total;
},0)}
Total Out of Stock : ${newMyFile.reduce((total,item)=>{
    if(item.quantity===0) return total+item.quantity;
    else return total;
},0)}
`;

    console.log(str);
    // check 
}

// console.log(process.argv);