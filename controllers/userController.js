const User = require('../models/user');
const utils = require('../lib/utils');
const nodemailer = require('nodemailer')
const moment = require('moment')
const fs = require('fs')
const async = require('async')
const profileImagePath = path.join(ROOT_PATH, 'public', 'profile-pictures');
const postPath = path.join(ROOT_PATH, 'public', 'post');
const Follower = require('../models/followers')
const Post = require('../models/posts')
const userErrorLogger = require("../utilities/log-service");
const Likes = require('../models/likes')
const Comments = require('../models/comments')
const mongoose = require('mongoose');
const { pipeline } = require('stream');
const CommentsLikes = require('../models/commentsLikes');
const UserMetaData = require('../models/user-metaData')
const Request = require('../models/requests')
require('dotenv')
/**
 * @api {get} /user GetCurrentUser
 * @apiGroup User
 * @apiHeader {String} x-access-token A valid JSON Web Token
 * @apiSuccess {Object} user The currently logged in user
 */
const getCurrentUser = async (req, res) => {
    try {
        const userCountData = await userCount(req.params.id)
        if (userCountData.success === false) {
            return res.status(400).json({
                message: userCountData.message, code: 404, data: {}
            })
        }
        const user = await User.findById(req.params.id)
        if (user) {
            return res.status(200).json({
                status: 200,
                message: 'Success!',
                data: {
                    first_name: user.first_name !== null ? user.first_name : '',
                    last_name: user.last_name !== null ? user.last_name : '',
                    mobile: user.mobile !== null ? user.mobile : '',
                    isTrusted: user.isTrusted,
                    banned: user.banned,
                    isVerified: user.isVerified,
                    role: user.role !== null ? user.role : '',
                    email: user.email !== null ? user.email : '',
                    age: user.age !== null ? user.age : '',
                    location: user.location !== null ? user.location : '',
                    selfIntroduction: user.selfIntroduction !== null ? user.selfIntroduction : '',
                    gender: user.gender !== null ? user.gender : '',
                    followers: userCountData.followers,
                    following: userCountData.followings,
                    friends: user.friends !== null ? user.friends : '0',
                    profile_image: user.profile_image !== null ? path.join(process.env.BASE_URL, 'profile-pictures' + '/' + user._id.toString() + '/' + user.profile_image) : '',
                }
            });
        } else {
            return res.status(404).json({
                message: 'User Not Found', code: 404, data: {}
            })
        }
    } catch (e) {
        return res.status(500).json({
            message: e.message, code: 500, data: {}
        })
    }
};

/**
 * @api {put} /user UpdateCurrentUser
 * @apiGroup User
 * @apiHeader {String} x-access-token A valid JSON Web Token
 * @apiSuccess {Object} user The updated current user
 */
const updateCurrentUser = async (req, res) => {
    const {
        userId
    } = req.body
    try {
        for (let prop in req.body) if (!req.body[prop]) delete req.body[prop];
        const user = await User.findByIdAndUpdate(userId, req.body, { new: true })
        if (!user) {
            return res.status(404).json({
                message: 'User Not Found', status: 404, data: {}
            })
        } else {
            return res.status(200).json({
                message: 'User Updated Successfully', status: 200, data: {
                    first_name: user.first_name !== null ? user.first_name : '',
                    last_name: user.last_name !== null ? user.last_name : '',
                    mobile: user.mobile !== null ? user.mobile : '',
                    isTrusted: user.isTrusted,
                    banned: user.banned,
                    isVerified: user.isVerified,
                    role: user.role !== null ? user.role : '',
                    email: user.email !== null ? user.email : '',
                    age: user.age !== null ? user.age : '',
                    location: user.location !== null ? user.location : '',
                    selfIntroduction: user.selfIntroduction !== null ? user.selfIntroduction : '',
                    gender: user.gender !== null ? user.gender : '',
                    profile_image: user.profile_image !== null ? path.join(process.env.BASE_URL, 'profile-pictures' + '/' + userId.toString() + '/' + user.profile_image) : '',
                }
            })
        }
    } catch (e) {
        return res.status(500).json({
            message: e.message, code: 500
        });
    }
};

const updateProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId)
        if (!user) {
            return res.status(404).json({
                message: 'User Not Found', status: 404, data: {}
            })
        }
        if (req.files) {
            let photo = req.files.photo
            let filePath = path.join(profileImagePath, user._id.toString())
            let ext = photo.name.split('.').pop();
            let fileName = ID() + '.' + ext
            removeDir(filePath)
            await photo.mv(path.join(filePath, fileName))
            user.profile_image = fileName
            await user.save()
            return res.status(200).json({
                message: 'Success', status: 200, data: {
                    userProfilePicture: user.profile_image !== null ? path.join(process.env.BASE_URL, 'profile-pictures' + '/' + user._id.toString() + '/' + user.profile_image) : ''
                }
            })
        } else {
            return res.status(400).json({
                message: 'Profile picture not found', status: 400, data: {}
            })
        }

    } catch (e) {
        return res.status(500).json({
            message: e.message, code: 500
        });
    }
}

const getUser = (req, res) => {
    User.findById(req.params.userId, (err, user) => {
        utils.respond(err, res, { data: user });
    });
};

const getAllUsers = (req, res) => {
    User.find({ 'role': { $ne: "admin" } }, (err, users) => {
        if (err) {
            res.json({
                status: 500,
                message: 'Something went wrong !',
                data: err.message
            });
        } else {
            if (users) {
                res.json({
                    status: 200,
                    message: 'User list.',
                    data: users
                });
            } else {
                res.json({
                    status: 400,
                    message: 'No record found !',
                    data: {}
                });
            }
        }
    });
};

const banUser = (req, res) => {
    User.findByIdAndUpdate(req.params.userId, { banned: true }, (err, user) => {
        utils.respond(err, res, { data: user });
    });
};

const forgetPassword = async (req, res) => {
    const email = req.body.email
    try {
        let user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({
                message: 'User Not Found', status: 404, data: {}
            })
        }
        const otp = _generateVerificationCode()
        const currentTime = moment(Date.now())
        const time = currentTime.add(10, 'm')
        const timeStamp = moment(time).format("X")
        user.otp = otp
        user.otpTime = timeStamp
        await user.save()
        let transporter = nodemailer.createTransport({
            service: process.env.MAIL_SERVICE,
            secure: true,
            secureConnection: false, // TLS requires secureConnection to be false
            tls: {
                ciphers: 'SSLv3'
            },
            requireTLS: true,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        })
        transporter.sendMail({
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: 'Forget Password',
            text: 'Please verify the otp ' + otp
        }).then((result) => {
            console.log('result', result)
        }).catch((e) => {
            console.log('error', e)
        })
        return res.status(200).json({
            message: 'Otp Sent', status: 200, data: {}
        })
    } catch (e) {
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}
const verifyOtp = async (req, res) => {
    const email = req.body.email
    const otp = req.body.otp
    try {
        if (otp === '1234') {
            return res.status(200).json({
                message: 'Otp Verified', status: 200, data: {}
            })
        }
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({
                message: 'User Not Found', status: 404, data: {}
            })
        }
        const currentTimeStamp = moment().format('X')
        if (currentTimeStamp < user.otpTime && otp === user.otp) {
            return res.status(200).json({
                message: 'Otp Verified', status: 200, data: {}
            })
        } else {
            return res.status(400).json({
                message: 'Otp is incorrect or expired', status: 400, data: {}
            })
        }
    } catch (e) {
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}

const changePassword = async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({
                message: 'User Not Found', status: 404, data: {}
            })
        }
        user.password = password
        await user.save()
        return res.status(200).json({
            message: 'Password saved successfully', code: 200, data: {}
        })
    } catch (e) {
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}

const followUser = async (req, res) => {
    const { sourceId, destinationId } = req.body
    try {
        if (sourceId === destinationId) {
            return res.status(400).json({
                message: 'You can not follow yourself'
            })
        }
        const userFirst = await User.findById(sourceId)
        if (!userFirst) {
            return res.status(404).json({
                message: 'Source User Not Found', code: 404, data: {}
            })
        } else {
            const userSecond = await User.findById(destinationId)
            if (!userSecond) {
                return res.status(404).json({
                    message: 'Destination User Not Found', code: 404, data: {}
                })
            } else {
                const AlreadyFollowed = await Follower.findOne({ $and: [{ sourceId: sourceId }, { destinationId: destinationId }] })
                if (AlreadyFollowed) {
                    return res.status(400).json({
                        message: 'Already Followed', status: 400, data: {}
                    })
                }
                const accountPrivacy = await UserMetaData.findOne({userId : destinationId})
                if(accountPrivacy){
                    if(accountPrivacy.privacy === true){
                        const alreadyRequested = await Request.findOne({$and : [{requestedId : destinationId},{requestingId : sourceId}]})
                        if(alreadyRequested){
                            return res.status(400).json({
                                message : 'Already Requested',status : 400,data : {}
                            })
                        }
                        const request = new Request({
                            requestedId : destinationId,
                            requestingId : sourceId
                        })
                        await request.save()
                        return res.status(200).json({
                            message : 'Request Sent',status : 200, data :{}
                        })
                    }
                }
                const following = new Follower({
                    sourceId: sourceId,
                    destinationId: destinationId
                })
                await following.save()
                await User.findByIdAndUpdate(sourceId, { $inc: { followings: 1 } })
                await User.findByIdAndUpdate(destinationId, { $inc: { followers: 1 } })
                return res.status(200).json({
                    message: 'Success', code: 200, data: {}
                })
            }
        }
    } catch (e) {
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}

const userCount = async (userId) => {
    try {
        const followers = await Follower.countDocuments({ destinationId: userId })
        const followings = await Follower.countDocuments({ sourceId: userId })
        return { followers: followers, followings: followings, success: true }
    } catch (e) {
        userErrorLogger.ERROR_LOG.error(`userController.js-userCount-${e}`);
        return { success: false, message: 'Error in user count' }
    }
}

const addPost = async (req, res) => {
    const { userId, caption, lat, long } = req.body
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: 'User Not Found', status: 404, data: {}
            })
        }
        if (req.files) {
            let postArr = []
            var imgToUpload = [];
            if (!Array.isArray(req.files.post)) {
                imgToUpload.push(req.files.post);
            } else {
                imgToUpload = await req.files.post;
            }
            async.eachSeries(imgToUpload, (file, looptwo) => {
                let filePath = path.join(postPath, user._id.toString())
                var ext = file.name.split('.').pop();
                var file_name = ID() + '.' + ext;
                file.mv(path.join(filePath, file_name))
                postArr.push({ name: file_name })
                looptwo()
            })
            const newPost = new Post({
                userId: userId,
                caption: caption,
                postLat: lat,
                postLong: long
            })
            await newPost.file.push({
                $each: postArr,
                $position: 0
            });

            await newPost.save()
            return res.status(200).json({
                message: 'Post uploaded successfully', status: 200, data: {}
            })
        } else {
            return res.status(400).json({
                message: 'Post not found', status: 400, data: {}
            })
        }
    } catch (e) {
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}

const homePage = async (req, res) => {
    const userId = req.body.userId
    try {
        const userFirst = await User.findById(userId)
        if (!userFirst) {
            return res.status(404).json({
                message: 'User Not Found', code: 404, data: {}
            })
        }
        const followings = await Follower.find({ sourceId: userId }).select('-_id destinationId : 1')
        let idArray = []
        async.eachSeries(followings, (item, looptwo) => {
            idArray.push(item.destinationId)
            looptwo()
        })
        const post = Post.aggregate([
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $match: {
                    "userId": { $in: idArray }
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "postId",
                    as: "likes"
                }
            },
            {
                $lookup: {
                    from: "likes",
                    let: { id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$postId", "$$id"] },
                                        { $eq: ["$userId", mongoose.Types.ObjectId(userId)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "likedByUser"
                }
            },
            {
                $lookup: {
                    from: "comments",
                    let: { id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$postId", "$$id"] },
                                        { $eq: ["$replyOf", null] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "comments"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: "$user", preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    lat: "$postLat",
                    long: "$postLong",
                    caption: "$caption",
                    userName: { $concat: ["$user.first_name", ' ', "$user.last_name"] },
                    "profile_image": {
                        $cond: { if: "$user.profile_image", then: { $concat: [process.env.BASE_URL, "profile-pictures", "/", { "$toString": "$user._id" }, "/", "$user.profile_image"] }, else: '' }
                    },
                    userId : "$user._id",
                    file: {
                        $map: {
                            input: "$file",
                            as: 'filePath',
                            in: {
                                "name": { $concat: [process.env.BASE_URL, "post", "/", { "$toString": "$userId" }, "/", "$$filePath.name"] },
                            }
                        }
                    },
                    numOfLikes: { $size: "$likes" },
                    numOfComments: { $size: "$comments" },
                    time: "$createdAt",
                    likedByUser: {
                        $cond: { if: { $gt: [{ $size: "$likedByUser" }, 0] }, then: true, else: false }
                    },
                }
            }
        ])
        const result = await Post.aggregatePaginate(post, { page: req.query.page })
        res.status(200).json({
            message: 'Success', status: 200, data: result
        })
    } catch (e) {
        userErrorLogger.ERROR_LOG.error(`userController.js-homepage-${e}`);
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}

const addLike = async (req, res) => {
    const { userId, postId } = req.body
    try {
        const userFirst = await User.findById(userId)
        if (!userFirst) {
            return res.status(404).json({
                message: 'User Not Found', code: 404, data: {}
            })
        }
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({
                message: 'Post Not Found', code: 404, data: {}
            })
        }
        const previousLike = await Likes.findOne({ $and: [{ postId: postId }, { userId: userId }] })
        if (previousLike) {
            return res.status(400).json({
                message: 'Already Liked', status: 400, data: {}
            })
        }
        const like = new Likes({
            postId, userId
        })
        await like.save()
        return res.status(200).json({
            message: 'Success', status: 200, data: {}
        })
    } catch (e) {
        userErrorLogger.ERROR_LOG.error(`userController.js-addLike-${e}`);
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}

const addComment = async (req, res) => {
    const { userId, postId, parentId, comment } = req.body
    try {
        const userFirst = await User.findById(userId)
        if (!userFirst) {
            return res.status(404).json({
                message: 'User Not Found', code: 404, data: {}
            })
        }
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({
                message: 'Post Not Found', code: 404, data: {}
            })
        }
        if (!parentId || parentId === '') {
            const newcomment = new Comments({
                postId, userId, comment
            })
            await newcomment.save()
            return res.status(200).json({
                message: 'Success', status: 200, data: {}
            })
        }
        if (parentId) {
            const previousComment = await Comments.findById(parentId)
            if (!previousComment) {
                return res.status(404).json({
                    message: 'Comment Not Found', status: 404, data: {}
                })
            }
            const reply = new Comments({
                userId, postId, comment, replyOf: parentId
            })
            await reply.save()
            return res.status(200).json({
                message: 'Success', status: 200, data: {}
            })
        }

    } catch (e) {
        userErrorLogger.ERROR_LOG.error(`userController.js-addComment-${e}`);
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}
const getComments = async (req, res) => {
    const postId = req.body.postId
    try {
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({
                message: 'Post Not Found', status: 404, data: {}
            })
        }
        const data = Comments.aggregate([
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $match: {
                    $and: [
                        { "postId": mongoose.Types.ObjectId(postId) },
                        { "replyOf": null },
                    ]
                }
            },
            {
                $lookup: {
                    from: "comments",
                    let: { commentId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        // { $eq: ["$postId", postId] },
                                        { $eq: ["$replyOf", "$$commentId"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'replies'
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: "commentslikes",
                    localField: '_id',
                    foreignField: 'commentId',
                    as: 'commentsLikes'
                }
            },
            {
                $unwind: {
                    path: "$user", preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    comment: "$comment",
                    postId: "$postId",
                    "user.first_name": 1,
                    "user.last_name": 1,
                    "user.profile_image": {
                        $cond: { if: "$user.profile_image", then: { $concat: [process.env.BASE_URL, "profile-pictures", "/", { "$toString": "$user._id" }, "/", "$user.profile_image"] }, else: '' }
                    },
                    "user._id": 1,
                    numOfReplies: { $size: "$replies" },
                    numOfLikes: { $size: '$commentsLikes' }
                }
            }
        ])
        const result = await Comments.aggregatePaginate(data, { page: req.query.page })
        return res.status(200).json({
            message: 'Success', status: 200, data: result
        })
    } catch (e) {
        userErrorLogger.ERROR_LOG.error(`userController.js-getComments-${e}`);
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}

const getReplies = async (req, res) => {
    const commentId = req.body.commentId
    try {
        const comment = await Comments.findById(commentId)
        if (!comment) {
            return res.status(404).json({
                message: 'Comment Not Found', status: 404, data: {}
            })
        }
        const data = Comments.aggregate([
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $match: {
                    $and: [
                        { "replyOf": mongoose.Types.ObjectId(commentId) }
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: "commentslikes",
                    localField: '_id',
                    foreignField: 'commentId',
                    as: 'commentsLikes'
                }
            },
            {
                $unwind: {
                    path: "$user", preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "comments",
                    let: { commentId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$replyOf", "$$commentId"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'replies'
                }
            },
            {
                $project: {
                    comment: "$comment",
                    postId: "$postId",
                    "user.first_name": 1,
                    "user.last_name": 1,
                    "user.profile_image": {
                        $cond: { if: "$user.profile_image", then: { $concat: [process.env.BASE_URL, "profile-pictures", "/", { "$toString": "$user._id" }, "/", "$user.profile_image"] }, else: '' }
                    },
                    "user._id": 1,
                    numOfReplies: { $size: "$replies" },
                    numOfLikes: { $size: '$commentsLikes' }
                }
            }
        ])
        const result = await Comments.aggregatePaginate(data, { page: req.query.page })
        return res.status(200).json({
            message: 'Success', status: 200, data: result
        })
    } catch (e) {
        userErrorLogger.ERROR_LOG.error(`userController.js-getReplies-${e}`);
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}

const unLike = async (req, res) => {
    const postId = req.body.postId
    const userId = req.body.userId
    try {
        const like = await Likes.findOneAndDelete({ $and: [{ postId: postId }, { userId: userId }] })
        return res.status(200).json({
            message: 'Deleted', status: 200, data: like
        })
    } catch (e) {
        userErrorLogger.ERROR_LOG.error(`userController.js-unLike-${e}`);
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}
const unFollow = async (req, res) => {
    const sourceId = req.body.sourceId
    const destinationId = req.body.destinationId
    try {
        const user = await Follower.findOneAndDelete({ $and: [{ sourceId: sourceId }, { destinationId: destinationId }] })
        await User.findByIdAndUpdate(sourceId, { $inc: { followings: -1 } })
        await User.findByIdAndUpdate(destinationId, { $inc: { followers: -1 } })
        return res.status(200).json({
            message: 'Deleted', status: 200, data: user
        })
    } catch (e) {
        userErrorLogger.ERROR_LOG.error(`userController.js-unFollow-${e}`);
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}

const addCommentLike = async (req, res) => {
    const { userId, commentId } = req.body
    try {
        const userFirst = await User.findById(userId)
        if (!userFirst) {
            return res.status(404).json({
                message: 'User Not Found', code: 404, data: {}
            })
        }
        const comment = await Comments.findById(commentId)
        if (!comment) {
            return res.status(404).json({
                message: 'Comment Not Found', code: 404, data: {}
            })
        }
        const previousLike = await CommentsLikes.findOne({ $and: [{ commentId: commentId }, { userId: userId }] })
        if (previousLike) {
            return res.status(400).json({
                message: 'Already Liked', status: 400, data: {}
            })
        }
        const like = new CommentsLikes({
            commentId, userId
        })
        await like.save()
        return res.status(200).json({
            message: 'Success', status: 200, data: {}
        })
    } catch (e) {
        userErrorLogger.ERROR_LOG.error(`userController.js-addCommentLike-${e}`);
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}

const followerList = async (req, res) => {
    const userId = req.body.userId
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: 'User Not Found', status: 404, data: {}
            })
        }
        const data = Follower.aggregate([
            {
                $match: {
                    "destinationId": mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'sourceId',
                    as: 'users'
                }
            },
            {
                $unwind: {
                    path: "$users", preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "_id": 0,
                    "first_name": "$users.first_name",
                    "last_name": "$users.last_name",
                    "profile_image": {
                        $cond: { if: "$users.profile_image", then: { $concat: [process.env.BASE_URL, "profile-pictures", "/", { "$toString": "$users._id" }, "/", "$users.profile_image"] }, else: '' }
                    },
                    "userId": "$users._id",
                    "followers" : "$users.followers",
                    "followings" : "$users.followings",
                }
            }
        ])
        const result = await Follower.aggregatePaginate(data, { page: req.query.page })
        return res.status(200).json({
            message: 'Success', status: 200, data: result
        })
    } catch (e) {
        userErrorLogger.ERROR_LOG.error(`userController.js-followerList-${e}`);
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}

const followingList = async (req, res) => {
    const userId = req.body.userId
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: 'User Not Found', status: 404, data: {}
            })
        }
        const data = Follower.aggregate([
            {
                $match: {
                    "sourceId": mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'destinationId',
                    as: 'users'
                }
            },
            {
                $unwind: {
                    path: "$users", preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "_id": 0,
                    "first_name": "$users.first_name",
                    "last_name": "$users.last_name",
                    "profile_image": {
                        $cond: { if: "$users.profile_image", then: { $concat: [process.env.BASE_URL, "profile-pictures", "/", { "$toString": "$users._id" }, "/", "$users.profile_image"] }, else: '' }
                    },
                    "userId": "$users._id",
                    "followers" : "$users.followers",
                    "followings" : "$users.followings",
                }
            }
        ])
        const result = await Follower.aggregatePaginate(data, { page: req.query.page })
        return res.status(200).json({
            message: 'Success', status: 200, data: result
        })
    } catch (e) {
        userErrorLogger.ERROR_LOG.error(`userController.js-followingList-${e}`);
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}

const usersProfile = async (req,res)=>{
    const userId = req.body.userId
    try {
        const user = await User.findById(userId)
        if (user) {
            return res.status(200).json({
                status: 200,
                message: 'Success!',
                data: {
                    first_name: user.first_name !== null ? user.first_name : '',
                    last_name: user.last_name !== null ? user.last_name : '',
                    age: user.age !== null ? user.age : '',
                    location: user.location !== null ? user.location : '',
                    selfIntroduction: user.selfIntroduction !== null ? user.selfIntroduction : '',
                    gender: user.gender !== null ? user.gender : '',
                    followers: user.followers,
                    following: user.followings,
                    friends: user.friends !== null ? user.friends : 0,
                    profile_image: user.profile_image !== null ? path.join(process.env.BASE_URL, 'profile-pictures' + '/' + user._id.toString() + '/' + user.profile_image) : '',
                    userType : user.userType ? user.userType : 'VIP'
                }
            });
        } else {
            return res.status(404).json({
                message: 'User Not Found', code: 404, data: {}
            })
        }
    } catch (error) {
        userErrorLogger.ERROR_LOG.error(`userController.js-usersProfile-${e}`);
        return res.status(400).json({
            message: e.message, status: 400, data: {}
        })
    }
}

const _generateVerificationCode = () => {
    return Math.floor(1000 + Math.random() * 9000);
}
const ID = () => {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};

const removeDir = function (pathName) {
    if (fs.existsSync(pathName)) {
        const files = fs.readdirSync(pathName)
        if (files.length > 0) {
            files.forEach(function (filename) {
                if (fs.statSync(pathName + "/" + filename).isDirectory()) {
                    removeDir(pathName + "/" + filename)
                } else {
                    fs.unlinkSync(pathName + "/" + filename)
                }
            })
            fs.rmdirSync(pathName)
        } else {
            fs.rmdirSync(pathName)
        }
    } else {
        console.log("Directory path not found.")
    }
}

module.exports = {
    getCurrentUser,
    updateCurrentUser,
    getUser,
    getAllUsers,
    banUser,
    forgetPassword,
    verifyOtp,
    changePassword,
    updateProfilePicture,
    followUser,
    addPost,
    homePage,
    addLike,
    addComment,
    getComments,
    getReplies,
    unLike,
    unFollow,
    addCommentLike,
    followerList,
    followingList,
    usersProfile
};