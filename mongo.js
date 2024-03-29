const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]


const url =
  `mongodb+srv://fullstackopenuser:${password}@cluster0-wruyp.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (!name && !number) {
  Person.find({}).then(persons => {
    console.log('Phonebook:')
    persons.forEach( person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })

} else {
  const person = new Person({
    name: name,
    number:number,
  })

  person.save().then(person => {
    console.log(`${person.name} saved to database with number: ${person.number}!`)
    mongoose.connection.close()
  })
}
