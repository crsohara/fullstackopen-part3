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
  Person.find({})
    .then(persons => {
      res.send(`<p>Phonebook has info for ${persons.length} people<p><p>${date}</p>`)
    })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.post('/api/persons', (req, res, next) => {
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

  person.save()
    .then(person => {
      console.log(`${person.name} saved to database with number: ${person.number}!`)
      res.json(person.toJSON())
    })
    .catch(error => next(error))

})

app.get('/api/persons/:id', (req, res) => {

  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true } )
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({error: error.message})
  }

  next(error)
}

app.use(errorHandler)