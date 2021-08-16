const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    name : {
        type : String
    },
    previleges : [],
    restrictions : []
});

const Role = mongoose.model('Role', Schema);

module.exports = Role;