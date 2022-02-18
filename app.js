const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()
app.use(express.json({limit: '50mb', extended: true }));
app.use(express.urlencoded({limit: '50mb'}));

const PORT = config.get('port') || 5000



app.use('/api/auth', require('./routes/auth.routes'))

async function start() {
    try {
        await mongoose.connect(config.get('MongoURL'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        app.listen(PORT, () => {console.log(`${PORT}`)}, '0.0.0.0')
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
}

start()