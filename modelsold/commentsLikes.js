const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    commentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'comments'
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
},{timestamps : true})

const CommentsLikes = mongoose.model('commentsLikes',schema)

module.exports = CommentsLikes