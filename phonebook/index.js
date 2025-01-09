require('dotenv').config({ path: '.env' });
const morgan = require('morgan')
const cors = require('cors')

const express = require('express')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const Person = require('./models/contact');

// get info
app.get('/info', (request, response) => { 
  const date = new Date()
  const persons = Person.find({}).then(persons => { return persons })
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

// get all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// get one person
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        console.log('no existe')
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log('error en busqueda')
      console.log(error)
      response.status(500).end()
    })
})

// delete one person
app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(deletedPerson => {
      response.json(deletedPerson)
    })
    .catch(error => {
      console.log(error)
      response.status(500).end()
    })
})

// post one person
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || body.name.trim().length === 0) {
    return response.status(400).json({ 
      error: 'missing name' 
    })
  }
  if (!body.number || body.number.trim().length === 0) {
    return response.status(400).json({ 
      error: 'missing number' 
    })
  }
  Person.find({}).then(persons => {
    if (persons.find(person => person.name === body.name)) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
  })

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})