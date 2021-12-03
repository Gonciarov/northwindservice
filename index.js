var express = require("express")
var cors = require('cors')
var fs = require('fs')

const port = 3001
const resources = [{
        url: '/Products',
        file: './json/products.json'
    },
    {
        url: '/Customers',
        file: './json/customers.json'
    }
]

var app = express()
app.use(cors())

resources.forEach(resource => {
    app.get(resource.url, (req, res, next) => {
        try {
            const resultsString = fs.readFileSync(resource.file)
            const results = JSON.parse(resultsString)
            res.json(results)
        } catch (err) {
            console.log(err)
        }
    })
})

app.get('/Pets', (req, res, next) => {
    try {
        const id = req.query.id
        const animal = req.query.animal
        const breed = req.query.breed
        const location = req.query.location
        const resultsString = fs.readFileSync('./json/pets.json')

        let results = JSON.parse(resultsString)
        if (id) {
            results.pets = results.pets.filter(pet => pet.id.toString() === id)
        }
        if (animal) {
            results.pets = results.pets.filter(pet => pet.animal === animal)
        }
        if (breed) {
            results.pets = results.pets.filter(pet => pet.breed === breed)
        }
        if (location) {
            results.pets = results.pets.filter(pet => {
                const cityAndState = `${pet.city} ${pet.state}`
                return cityAndState.toLowerCase().includes(location.toLowerCase())
            })
        }
        res.json(results)
        console.log(`Call to /Pets id=${id}, animal=${animal}, breed=${breed} location=${location} returned ${results.pets.length} result/s`)
    } catch (err) {
        console.log(err)
    }
})

app.listen(port, () => {
    console.log(`Northwind service is running on port ${port}`)
})