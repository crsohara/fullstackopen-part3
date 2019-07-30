const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())

morgan.token('request-content', (req, res) => JSON.stringify(req.body) )

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-content'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

function generateId(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`<p>Phonebook has info for ${persons.length} people<p><p>${date}</p>`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
  const name = req.body.name
  const number = req.body.number

  if (!name) {
    return res.status(400).json({ error: "Name missing" })
  }

  if (!number) {
    return res.status(400).json({ error: "Number missing" })
  }

  if (persons.find( person => person.name === name )) {
    return res.status(400).json({ error: "Name must be unique" })
  }

  const person = {
    name: name,
    number: number,
    id: generateId(100)
  }

  persons = persons.concat(person)

  res.json(person)

})

app.get('/api/persons/:id', (req, res) => {

  const id = Number(req.params.id)
  const person = persons.find( person => person.id === id)

  if (!person) {
    res.status(404).end()
  }

  res.json(persons.find( person => person.id === id))

})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter( person => person.id !== id)
  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})