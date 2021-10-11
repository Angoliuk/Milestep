const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {type: String},
    edrpou: {type: Number},
    numOfWorkers: {type: Number},
    payerPDW: {type: Boolean},
    address: {type: String},
    phoneNum: {type: Number},
    salary: {type: Number},
    responsible: {type: String},
    taxationSystem: {type: String},
    tasks: {type: Array}
})

module.exports = model('Company', schema)