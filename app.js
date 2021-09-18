const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

app.use(express.json({ extended: true }))

const PORT = config.get('port') || 5000



app.use('/api/auth', require('./routes/auth.routes'))

async function start() {
    try {
        await mongoose.connect(config.get('MongoURL'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        app.listen(PORT, () => {console.log(`${PORT}`)})
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
}

start()