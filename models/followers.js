const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
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
schema.plugin(aggregatePaginate)
const Follower = mongoose.model('followers', schema)
module.exports = Follower