const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Language = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
}, { timestamps: true });

module.exports = mongoose.model('Language', Language);