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
    },
    comment : {
        type : String,
        default:''
    },
    replyOf : {
        type : mongoose.Schema.Types.ObjectId,
        default : null
    }
},{timestamps : true})

schema.plugin(aggregatePaginate);
const Comments = mongoose.model('comments',schema)

module.exports = Comments