const Request = require('../models/requests')
const Follower = require('../models/followers')
const User = require('../models/user')

const acceptRequest = async (req, res) => {
    const { requestedId, requestingId } = req.body
    try {
        const data = await Request.findOne({ $and: [{ requestedId: requestedId }, { requestingId: requestingId },{status : false}] })
        if (!data) {
            return res.status(404).json({
                message: DM.NO_RECORD_FOUND, status: 404, data: {}
            })
        }
        data.status = true
        await data.save()
        const follower = await new Follower({
            sourceId: requestingId,
            destinationId: requestedId
        })
        await follower.save()
        await User.findByIdAndUpdate(requestingId, { $inc: { followings: 1 } })
        await User.findByIdAndUpdate(requestedId, { $inc: { followers: 1 } })
        return res.status(200).json({
            message: DM.SUCCESS, status: 200, data: {}
        })
    } catch (e) {
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}

const declineRequest = async (req,res)=> {
    const { requestedId, requestingId } = req.body 
    try {
        const data = await Request.findOneAndDelete({ $and: [{ requestedId: requestedId }, { requestingId: requestingId }] })
        if (!data) {
            return res.status(404).json({
                message: DM.NO_RECORD_FOUND, status: 404, data: {}
            })
        }
        return res.status(200).json({
            message: DM.SUCCESS, status: 200, data: {}
        })
    } catch (e) {
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}

module.exports = {
    acceptRequest,
    declineRequest
}