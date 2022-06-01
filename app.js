const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json({limit: "500mb"}));
app.use(bodyParser.urlencoded({limit: "500mb", extended: true, parameterLimit:50000}));

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