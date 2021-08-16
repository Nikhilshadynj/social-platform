const express = require('express')
const Post = require('../models/posts')
const userErrorLogger = require("../utilities/log-service");
const router = new express.Router()

router.get('/removeStory', async (req, res) => {
    const date = new Date()
    const data = await Post.aggregate([
        {
            $match: {
                'type': 'story'
            }
        },
        {
            $project: {
                _id: 1,
                duration: { $divide: [{ $subtract: [date, "$createdAt"] }, 3600000] }
            }
        },
        {
            $match: {
                "duration": { $gt: 24 }
            }
        },
    ])
    if (data.length > 0) {
        sanam.forEach((item) => {
            Post.deleteOne({ _id: item._id }).then((result) => {
                res.end()
            }).catch((e) => {
                userErrorLogger.ERROR_LOG.error(`cron.js--removeStory-${e}`);
            })
        })
    } else {
        res.end()
    }
})

module.exports = router