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
    },

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
        let pets = results.pets

        if (id) {
            pets = pets.filter(pet => pet.id.toString() === id)
        }
        if (animal) {
            pets = pets.filter(pet => pet.animal === animal)
        }
        if (breed) {
            pets = pets.filter(pet => pet.animal === animal).filter(i => i.breed = breed)

        }
        if (location) {
            pets = pets.filter(pet => {
                const cityAndState = `${pet.city} ${pet.state}`
                return cityAndState.toLowerCase().includes(location.toLowerCase())
            })
        }

        const baseImageUrl = `http://${req.hostname}:${port}/images`
        pets = pets.map((pet) => {
            pet.images = pet.images.map((image) => `${baseImageUrl}/${image}`)
            return pet
        })

        results.pets = pets
        res.json(results)
        console.log(`Call to /Pets id=${id}, animal=${animal}, breed=${breed} location=${location} returned ${results.pets.length} result/s`)
    } catch (err) {
        console.log(err)
    }
})

app.get('/Breeds', (req, res, next) => {
    try {
        const animal = req.query.animal
        const resultsString = fs.readFileSync('./json/breeds.json')

        let results = JSON.parse(resultsString)

        if (animal) {
            results.breeds = results.breeds.filter(i => i.animal === animal)[0]["breeds"]

        }
        res.json(results.breeds)
        console.log(`Call to /Breeds animal=${animal}, breeds=${results.breeds}`)
    } catch (err) {
        console.log(err)
    }
})

app.get('/images/:file', (req, res, next) => {
    try {
        const file = req.params.file;
        res.sendFile(__dirname + '/json/images/' + file);
    } catch (err) {
        console.log(err)
    }
})

// app.get('/dictionary/:word', (req, res, next) => {
//     try {
//         const word = req.params.word;
//         const resultsString = fs.readFileSync('./json/dictionary.json')
//         let results = JSON.parse(resultsString)
//         let wordNeeded = results.find(word);
//         console.log(word)
        
//         console.log(`what we found: ${wordNeeded}`)
//         console.log(wordNeeded)
        
        
//         // res.send(`<h3>${results.word}</h3>`);
//     } catch (err) {
//         console.log(err)
//     }
// })

app.listen(port, () => {
    console.log(`Northwind service is running on port ${port}`)
    })

