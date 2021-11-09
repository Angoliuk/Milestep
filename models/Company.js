const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true},
    edrpou: {type: Number, required: true},
    numOfWorkers: {type: Number},
    payerPDW: {type: String},
    address: {type: String},
    phoneNum: {type: Number},
    // salary: {type: Number},
    responsible: {type: String},
    taxationSystem: {type: String},
    kwed: {type: String},
    infoESW: {type: String},
    tasks: {type: Array}
})

module.exports = model('Company', schema)