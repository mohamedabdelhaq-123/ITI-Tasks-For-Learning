const express = require('express')
const app = express()

app.use(express.json())

let students = [
  { id: 1, name: "Ahmed Hassan", age: 21 },
  { id: 2, name: "Sara Mansour", age: 22 }
];

app.get('/students', (req, res) => {
    if(!students) return res.status(404).json({error:"not found"});
  res.status(200).json({"students": students, "links":[{
    "method":"POST", "href" :"/students"},
    {"method": "Get" , "href": "/students/:id"},
    {"method": "PUT" , "href": "/students/:id"},
    {"method": "DELETE", "href": "/students/:id"}
  ]});
});

app.get('/students/:id', (req,res)=>{
    const {id}= req.params;
    const student = students.find((std)=> std.id === parseInt(id));
    if(!student) return res.status(404).json({error:"not found"})
    else return res.status(200).json(student);
})

app.put('/students/:id',(req,res)=>{
    const {id}= req.params;
    const {name , age} = req.body;
    const student = students.find((std)=> std.id === parseInt(id));
    if(!student) return res.status(404).json({error:"not found"})
    
    if (student.name !== name) student.name = name;
    if (student.age !== age ) student.age = age;

    return res.status(200).json(student);
});

app.delete('/students/:id', (req,res)=>{
    const {id}= req.params;
    const student = students.find((std)=> std.id === parseInt(id));
    if(!student) return res.status(404).json({error:"not found"})
    
    students=students.filter((std)=> std!==student);
res.status(200).json({message:"Deleted Succuessfully"});

});

app.post('/students', (req, res) => {
  const { name, age } = req.body;
  const newStudent = { id: students.length + 1, name, age };
  if(!name || !age) {
    return res.status(400).json({ error: "Name and age are required" });
  }
  students.push(newStudent);
  res.status(201).json(newStudent);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(3000, () => {
  console.log('Server is Running');
});