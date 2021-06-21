const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
}, (err, result) => {
    if (err) {
        console.log('Error', err)
    }
    if (result) {
        console.log('Connected')
    }
})