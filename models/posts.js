const mongoose = require('mongoose')
const mongoosePagination = require('mongoose-paginate-v2')
var aggregatePaginate = require("mongoose-aggregate-paginate-v2"); 
const schema = new mongoose.Schema({
    file : [{
        name : {type : String},    
    }],
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    postLat : {
        type : String,
        default : ''
    },
    postLong : {
        type : String,
        default : ''
    },
    caption : {
        type : String,
        default : ''
    },
    type : {
        type : String,
        default : 'post',
        lowercase : true
    }
},{timestamps : true})

schema.plugin(aggregatePaginate);
schema.plugin(mongoosePagination)
const Post = mongoose.model('posts',schema)

module.exports = Post