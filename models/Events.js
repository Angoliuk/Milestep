
const {Schema, model} = require('mongoose')

const schema = new Schema({
    date: {type: String},
    description: {type: String},
    owner: {type: String}
})

module.exports = model('EventNew', schema)