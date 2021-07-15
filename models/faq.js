const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Faqs = new Schema({
    question: { type: String },
    answer: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Faqs', Faqs);