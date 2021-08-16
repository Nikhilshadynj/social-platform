const mongoose = require('mongoose')
var aggregatePaginate = require("mongoose-aggregate-paginate-v2"); 
const schema = new mongoose.Schema({
    postId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'posts'
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
},{timestamps : true})

schema.plugin(aggregatePaginate);
const Likes = mongoose.model('likes',schema)

module.exports = Likes