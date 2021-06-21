const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    sourceId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    destinationId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
},{timestamps : true})

const Follower = mongoose.model('followers', schema)
module.exports = Follower