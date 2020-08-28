/* eslint-disable consistent-return */
require('dotenv').config();

const express = require('express');

const app = express();
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/persons');

app.use(express.json());
app.use(cors());
app.use(morgan((tokens, req, res) => {
  if (tokens.method(req, res) === 'POST') {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body),
    ].join(' ');
  }
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
  ].join(' ');
}));
app.use(express.static('build'));

// let persons =
//  [
//     { name: 'Arto Hellas', number: '040-123456' , id:1},
//     { name: 'Ada Lovelace', number: '39-44-5323523' ,id:2},
//     { name: 'Dan Abramov', number: '12-43-234345' ,id:3},
//     { name: 'Mary Poppendieck', number: '39-23-6423122', id:4 }
//   ]

const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.name === 'CastError') {
    return res.status(404).send({ error: 'bad id' });
  } if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message, message: 'This is a validation error yo' });
  }

  next(err);
};

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  })
    .catch((err) => next(err));
});

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;
  Person.findById(id).then((person) => {
    res.json(person);
  })
    .catch((err) => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;
  Person.findByIdAndRemove(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.get('/info', (req, res) => {
  Person.find({}).then((persons) => {
    res.send(`<p>Phonebook has ${persons.length} people</p>
                <p>${new Date()}</p>`);
  });
});

app.post('/api/persons', (req, res, next) => {
  const { body } = req;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((person) => {
    res.json(person);
  })
    .catch((err) => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;
  console.log(req.body);
  const updatedPerson = {
    number: req.body.number,
  };

  Person.findByIdAndUpdate(id, updatedPerson, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((err) => next(err));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
