const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan((tokens, req, res) => {
    if(tokens.method(req,res) === 'POST') {
        return[
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            JSON.stringify(req.body)
        ].join(' ')
    }
    return[
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}))

let persons =
 [
    { name: 'Arto Hellas', number: '040-123456' , id:1},
    { name: 'Ada Lovelace', number: '39-44-5323523' ,id:2},
    { name: 'Dan Abramov', number: '12-43-234345' ,id:3},
    { name: 'Mary Poppendieck', number: '39-23-6423122', id:4 }
  ]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})  

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const newPersons = persons.filter(person => person.id !== id)
    persons = newPersons
    console.log(persons)
    res.status(204).end()
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has ${persons.length} people</p>
                <p>${new Date()}</p>`)
})

const generateID = () => {
    return Math.floor(Math.random() * 100000)
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error:'no name field'
        })
    } else if (!body.number ) {
        return res.status(400).json({
            error:'no number field'
        })
    } else if (persons.find(p => p.name === body.name)) {
        return res.status(400).json({
            error:'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateID()
    }

    persons = persons.concat(person)
    res.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})