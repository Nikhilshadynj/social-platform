const User = require('../../models/user');
const nodemailer = require('nodemailer')
const moment = require('moment')
const fs = require('fs')
const async = require('async')
const profileImagePath = path.join(ROOT_PATH, 'public', 'profile-pictures');
const postPath = path.join(ROOT_PATH, 'public', 'post');
const Follower = require('../../models/followers')
const Post = require('../../models/posts')
const userErrorLogger = require("../../utilities/log-service");
const Likes = require('../../models/likes')
const Comments = require('../../models/comments')
const mongoose = require('mongoose');
const { pipeline } = require('stream');
const CommentsLikes = require('../../models/commentsLikes');
const UserMetaData = require('../../models/user-metaData')
const Request = require('../../models/requests')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv')
/**
 * @api {get} /user GetCurrentUser
 * @apiGroup User
 * @apiHeader {String} x-access-token A valid JSON Web Token
 * @apiSuccess {Object} user The currently logged in user
 */
 const jwtExpirySeconds = 86400; // expires in 24 hours
 const algor = 'HS256';
 const login = (req, res) => {
    User.findOne({ $and : [{email: req.body.email},{role : 'admin'}]}, (err, user) => {
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                const token = jwt.sign({ userId: user._id }, 'secretKey', {
                    algorithm: algor,
                    expiresIn: jwtExpirySeconds,
                });
                res.json({
                    status: 200,
                    message: 'The user has been successfully logged in!',
                    data: {
                        first_name : user.first_name !== null ? user.first_name : '',
                        last_name :  user.last_name !== null ? user.last_name : '',
                        referral_code : user.referral_code !== null ? user.referral_code : '',
                        mobile : user.mobile !== null ? user.mobile : '',
                        password : user.password !== null ? user.password : '',
                        createdAt : user.createdAt !== null ? user.createdAt : '',
                        updatedAt : user.updatedAt !== null ? user.updatedAt : '',
                        _id : user._id,
                        otp : user.otp !== null ? user.otp : '',
                        isTrusted : user.isTrusted,
                        banned : user.banned,
                        isVerified : user.isVerified,
                        role : user.role !== null ? user.role : '',
                        email : user.email !== null ? user.email : '',
                        token : token
                    }
                }); 
            } else {
                res.status(400).json({
                    status: 400,
                    message: 'The password was incorrect.',
                    data: {}
                });
            }
        } else {
            res.status(400).json({
                status: 400,
                message: 'User Not Found', 
                data: {}
            });
        }
    });
}

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



module.exports = {
    getAllUsers,
    login
};