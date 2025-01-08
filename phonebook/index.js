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


let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]


// get info
app.get('/info', (request, response) => { 
  const date = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

// get all persons
app.get('/api/persons', (request, response) => {
  if (persons) {
    response.json(persons)
  }
  else {
    response.status(404).end()
  }
})

// get one person
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// delete one person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

// generate unique id
generateId = () => {
  let id = Math.floor(Math.random() * 1000000)
  while (persons.find(person => person.id === id)) {
    id = Math.floor(Math.random() * 1000000)
  }
  return Math.floor(Math.random() * 1000000)
}

// post one person
app.post('/api/persons', (request, response) => {
  const body = request.body

  // checks
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
  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  // create person object
  const person = {
    name: body.name,
    number: Number(body.number),
    id: generateId(),
  }

  persons = persons.concat(person)
  response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})