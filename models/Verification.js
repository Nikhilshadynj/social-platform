const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Verification = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    code: String,
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
});

module.exports = mongoose.model('Verification', Verification);