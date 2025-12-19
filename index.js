require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const PersonSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  Iname: String
});

const Person = mongoose.model('Person', PersonSchema);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("DB connected"))
  .catch(() => console.log("DB failed"));

app.post("/api", (req, res) => {
  const p1 = new Person({
    name: req.body.name,
    age: req.body.age,
    gender:req.body.gender,
    Iname:req.body.Iname
  });

  p1.save()
    .then(result => res.json(result))
    .catch(err => res.json(err));
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/add.html");
});

//you can search using age or Institute name

app.get("/api/:input", (req, res) => {
  const input = req.params.input;

  if (!isNaN(input)) {
    Person.find({ age: Number(input) })
      .then(result => res.json(result))
      .catch(err => res.json(err));
  } else {
    Person.find({ Iname: { $regex: new RegExp(input, "i") } })
      .then(result => res.json(result))
      .catch(err => res.json(err));
  }
});
app.get("/get-persons", (req, res) => {
     Person.find()
    .then(result => res.json(result))
    .catch(err => res.json(err));
});


if (process.env.NODE_ENV !== "production") {
  app.listen(8080, () => console.log("local server running"));
}

module.exports = app;
