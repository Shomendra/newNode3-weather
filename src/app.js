
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// deine paths for express confirg
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handlebar engibe and view location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


// setup static directory to serve
app.use(express.static(publicDirectoryPath))


app.get('', (req, res) => {
    res.render('index', {
        title: 'Waether App',
        name: 'Shomendra Prdhan'
    })

})

app.get('/about', (req, res) => {
    res.render('about', {

        title: 'About Me',
        name: 'Shomendra Pradhan'
    })

})


app.get('/help', (req, res) => {
    res.render('help', {

        helpText: 'This is helpfu text page.',
        title: 'Help',
        name: 'Shomendra Pradhan'
    })
})

app.get('/Weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })

    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forcastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forcast: forcastData,
                location,
                address: req.query.address

            })
        })
    })

})

app.get('/products', (req, res) => {

    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})


app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Shomendra',
        errorMessage: 'Help particle not found'

    })
})


app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Adrew Mead',
        errorMessage: 'Page not found'

    })
})



//app.com/help
//app.com/about

app.listen(port, () => {
    console.log('Server is up on port' + port)
})