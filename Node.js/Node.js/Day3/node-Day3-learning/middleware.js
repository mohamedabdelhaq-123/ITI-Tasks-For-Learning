const express = require("express"); // looks like lib. but behave like framework
const app = express(); // factory func ret obj

// need to use bruno
// Purpose:
// Send requests to your server (GET, POST, DELETE, etc.)
// See responses
// Test without writing frontend code
// mimic that user inputted data (you write it in body in bruno) converted to json  and there is request sent to server to create (post) the user data (data is in the request body that sent to server)


// ex on built in middleware
app.use(express.json());
// middleware parse json data coming from req body (user inputted data)
// Convert req.body (Json => js object) and append to req.body
// must be placed before routes, bec if routes need to access req.body (post,patch)
// activated when content-type header is 'app/json'


// ex on built in middleware
app.use(express.static("public")); 
// Middleware that serves static files (HTML, CSS, JS, images) from the 'public' folder
// before we needed to route for each file html,css,js and then send it
// Used for frontend assets that don't need server-side processing



// ex on app level middleware
app.use((req,res,next)=>{
    console.log("Hey I'm App Level Middleware");
    // console.log(`Request: ${req.method} ${req.url}`);
    next();
});

// ex on route level middleware
function middleware(req,res,next)
{
    // res.send("Middleware for Authentication");
    console.log("Middleware for Authentication");
    next();
}

app.get("/", middleware ,(req, res) => {
  console.log(typeof req.url); // this code occurs after the user type localhost... so the req is presented here so i can access it
  console.log(typeof req.method);
  res.send("Hi I'm In"); // send to browser
});


app.post("/user",(req,res)=>{
  console.log(req.body); // See data in terminal
  res.send(`Received: ${req.body.name}`);
});



app.get("/profile", (req, res) => {
  console.log(req.url);
  res.end("User Profile Page");
});
app.get("/settings", (req, res) => res.send("Setting page"));

// ex on routing param
app.get("/settings/:id",(req,res)=> {console.log("id"); res.send(`HEY:: ${req.params.id}`)});

// ex on query param
app.get("/user",(req,res)=> res.send(`${req.query.name},, ${req.query.age},,${req.query.color}`)); // url is like this: http://localhost:4004/user?name=mo&age=23&color=red what if color=red not presented so, show undefined no crash


// if no route matched the above the app.use() runs
app.use((req,res)=> res.status(404).send("ERRROOOOOOOR"));  // Sends status + custom message  ("Set response status to 404, then send the text 'ERRROOOOOOOR' to browser")
// or use 
// app.use((req, res) => res.sendStatus(404));        // Sends status + default message ("Not Found")
app.listen(4005, () => { console.log("App is up")});

// 1. express tell os i'm waiting at port 4004
// 2. in terminal App is up
///// user can type multiple types while the server is up
// 3. user type localhosst:portnumber(4004)/resource(todo) ==> localhost:4004/todo or if no resource  localhost:4004/ or localhost:4004
// 4. Request arrive at port 4004
// 5. app.get runs (last thing occurs res.end("...")=> send response to brower)
// 6. show data in end(" ") and connection closed
// 7. server is still up but connection is closed (listens for any req. on 4004)
// Analogy: Restaurant stays open (server) even after serving one customer (request),, res.end()==> just closes one request
