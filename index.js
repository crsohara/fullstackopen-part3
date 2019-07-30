require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

app.use(bodyParser.json())

morgan.token('request-content', (req, res) => JSON.stringify(req.body) )

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-content'))

app.use(cors())

app.use(express.static('build'))

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`<p>Phonebook has info for ${persons.length} people<p><p>${date}</p>`)
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
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

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(person => {
    console.log(`${person.name} saved to database with number: ${person.number}!`)
    res.json(person.toJSON())
  })

})

app.get('/api/persons/:id', (req, res) => {

  Person.findById(req.params.id)
    .then(person => {
      res.json(person.toJSON())
    })
    .catch(error => {
      res.status(404).end()
    })

})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
})

const PORT = process.env.PORT || process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})