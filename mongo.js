const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://user:${password}@cluster0.rwpxa.azure.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (name) {
  const newPerson = new Person({
    name,
    number,
  });
  newPerson.save().then((result) => {
    console.log(`Added ${name} number ${number} to the phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((results) => {
    results.forEach((item) => {
      console.log(item.name, item.number);
    });
    mongoose.connection.close();
  });
}
