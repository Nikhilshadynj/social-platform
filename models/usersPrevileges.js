const mongoose = require('mongoose')

const schema  = new mongoose.Schema({
    name : {
        type : String,
    }
},{timestamps : true})

const Previleges = mongoose.model('previleges',schema)

module.exports = Previleges