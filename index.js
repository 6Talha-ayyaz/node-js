require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const PersonSchema = new mongoose.Schema({
  name: String,
  age: Number
});

const Person = mongoose.model('Person', PersonSchema);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("DB connected"))
  .catch(() => console.log("DB failed"));

app.post("/api", (req, res) => {
  const p1 = new Person({
    name: req.body.name,
    age: req.body.age
  });

  p1.save()
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

app.get("/api/:input", (req, res) => {
  const input = req.params.input;

  if (!isNaN(input)) {
    Person.find({ age: Number(input) })
      .then(result => res.json(result))
      .catch(err => res.json(err));
  } else {
    Person.find({ name: { $regex: new RegExp(input, "i") } })
      .then(result => res.json(result))
      .catch(err => res.json(err));
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(8080, () => console.log("local server running"));
}

module.exports = app;
