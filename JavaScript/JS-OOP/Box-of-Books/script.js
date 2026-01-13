/*
3. Create your box object that contains books objects, ensure that you can
a. count # of books inside box.
b. delete any of these books in box according to book name or type.
c. create book object and add it to box object content property
d. use toString() to tell its dimensions and how books are stored in it.e. implement valueof() so that if there is more than one box object we can
a. get total books in these boxes by adding the i.e. box1
*/

class Box {

    constructor(c, h = 2, w = 2, l = 2, n = 2, v = 2, m = "Wood") // c at last to pass it array
    {
        this.content = c;  // arr of books
        this.height = h;
        this.width = w;
        this.length = l;
        this.nofBooks = this.content.length;
        this.volume = v;
        this.material = m;
    }

    toString() {
        return `The Box Height is ${this.height}, Width is ${this.width} and Length is ${this.length} \nThe Number of Books is ${this.nofBooks}`
    }

    addBook(newBook) {
        this.content.push(newBook);
        this.nofBooks++;
    }

    deleteBook( titletest = "Test",typetest = "Test") {
        
        if (typetest === "Test" && titletest !== "Test") // delete according to title (delete all)
        {
           // console.log(titletest);
            for (var i = 0; i < this.nofBooks; i++) {
              //  console.log(this.content[i].type)
                if (this.content[i].title === titletest) {
                   // this.content.pop(this.content[i]);
                   this.content.splice(i,1); // start from index i remove one element
                    this.nofBooks--;
                }
            }
        }
        else if (type !== "Test" && titletest === "Test")  // delete  with type only
        {
            for (var i = 0; i < this.nofBooks; i++) {
                if (this.content[i].type === typetest) {
                   // this.content.pop(this.content[i]);
                    this.content.splice(i,1);
                    this.nofBooks--;
                }
            }

        }
    }

    valueOf() {   // presented when instance is in place to make math with it
        return this.nofBooks;
    }
}

class Book {

    constructor(tit, n = 2, a = "MO", p = 200, pub = "Dar El Nshr", c = 2000, t = "SciFi") {
        this.title = tit;
        this.nOfChap = n;
        this.author = a;
        this.nOfPages = p;
        this.publisher = pub;
        this.nOfCopies = c;
        this.type = t;
    }
}

let b1 = new Book("Avatar");
let b2 = new Book("MO");
let b3 = new Book("atar");
let b4 = new Book("M");
let b5 = new Book("Avar");
let b6 = new Book("MOooo");
let box = new Box([b1, b2,b3,b4,b5,b6]);
let box2= new Box([b1,b2]);

box.deleteBook("Avater");

//console.log(box.toString());
console.log(box);


box.deleteBook("MO");
//console.log(box.toString());
console.log(box);



//console.log(box.toString());
box.addBook(new Book("bfrrrr"));
console.log(box);

//console.log(box.toString());
console.log(box+box2);