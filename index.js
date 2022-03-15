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
app.use(express.urlencoded())

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
            pets = pets.filter(pet => pet.animal === animal).filter(i => i.breed === breed)

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
            results.breeds = results.breeds.filter(i => i.animal === animal)[0]

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


app.get('/dictionary', (req, res) => {
    res.send(

        `<h1>Wandsworth Dictionary</h1><h3>Almost as good as Google. Almost as old as HMP Wandsworth, as based on 1913 Webster dictionary version.</h3></h3><form action="/dictionary" method="POST">
        <input type="text" id="word" name="word">
        <input type="submit" value="search">
    </form>
    <p>Like any service in this prison, Wandsworth Dictionary is not smart. It will not be even trying to decode your wrong spelling. Make sure you spell your word correctly.`);

})

app.post('/dictionary', (req, res, next) => {
    let word = JSON.stringify(req.body.word).slice(1, -1);
    const resultsString = fs.readFileSync('./json/dictionary.json')
    let results = JSON.parse(resultsString)

    let finalResults = results.words.filter(i => i.word === word)

      if (finalResults[0]) {
        let meaning = finalResults[0].meaning
        res.send(meaning + `<br/><br/><a href="/dictionary">Refresh page</a>`)
    } else {
        res.send(`<p>No results found</p><br/><br/><a href="/dictionary">Refresh page</a>`)
    }


})

app.get('/words/:word', (req, res, next) => {
    try {
        const word = req.params.word
        const resultsString = fs.readFileSync('./json/dict.json')

        let results = JSON.parse(resultsString)

        if (word) {
            console.log(word)

            let finalResults = results.words.filter(i => i.word === word)[0]
            res.json(finalResults.meaning)

        }

        //     const resultsString = fs.readFileSync('./json/dict.json')
        //     let results = JSON.parse(resultsString)
        //  console.log(results.json)



        // res.send(`<h3>${results.word}</h3>`);
    } catch (err) {
        console.log(err)
    }
})

app.listen(port, () => {
    console.log(`Northwind service is running on port ${port}`)
})