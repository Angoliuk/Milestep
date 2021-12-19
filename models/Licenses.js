const {model, Schema} = require('mongoose')

const schema =  new Schema({
    companyName: {type: String, required: true},
    licensesList: {type: Array}
})

module.exports = model('Licenses', schema)