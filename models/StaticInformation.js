const { Schema, model } = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true},
    info: {type: Array},
})

module.exports = model('StaticInformation', schema)