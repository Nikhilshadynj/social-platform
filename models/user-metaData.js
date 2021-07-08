const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    privacy : {
        type : Boolean,
        default : false
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        default : null
    }
},{timestamps : true})

const UserMetaData = mongoose.model('usersMetaData',schema)

module.exports = UserMetaData