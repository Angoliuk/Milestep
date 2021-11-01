const { Schema, model } = require('mongoose')

const schema = new Schema({
    name: {type: String},
    info: {type: Array},
})

module.exports = model('StaticInformation', schema)