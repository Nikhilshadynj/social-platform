const mongoose = require('mongoose')

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

const Likes = mongoose.model('likes',schema)

module.exports = Likes