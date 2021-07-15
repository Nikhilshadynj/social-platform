const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    status : {
        type : Boolean,
        default : false
    },
    requestedId : {
        type : mongoose.Schema.Types.ObjectId,
        default : null
    },
    requestingId : {
        type : mongoose.Schema.Types.ObjectId,
        default : null
    },

},{timestamps : true})

const UserRequest = mongoose.model('usersRequest',schema)

module.exports = UserRequest