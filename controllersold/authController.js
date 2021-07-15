const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Role = require('../models/role');
const Language = require('../models/language');
const Verification = require('../models/Verification');
const utils = require('../lib/utils');

const jwtKey = "secretkey";
const jwtExpirySeconds = 86400; // expires in 24 hours
const algor = 'HS256';

/**
 * @api {get} /role
 */
const language = (req, res) => {
    Language.find({}, (err, language) => {
        utils.respond(err, res, { 'data': language });
    });
}

/**
 * @api {get} /role
 */
const roles = (req, res) => {
    Role.find({ name: { $ne: 'admin' } }, (err, roles) => {
        utils.respond(err, res, { 'data': roles });
    });
}

/**
 * @api {post} /login Login
 */
const login = (req, res) => {
    User.findOne({ email: req.body.email}, (err, user) => {
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                const token = jwt.sign({ userId: user._id }, jwtKey, {
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
                message: 'Invalid email address.', 
                data: {}
            });
        }
    });
}

/**
 * @api {post} /register Join
 */
const register = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
           return res.status(400).json({
                status: 400,
                message: 'This email address is already taken. Please login or use the forgot password feature instead.'
            });
        }
        const mobile = await User.findOne({mobile : req.body.mobile})
        if (mobile) {
            return res.status(400).json({
                status: 400,
                message: 'This Mobile number is already taken.'
            });
        }

        const newUser = new User();
        newUser.role = req.body.role;
        newUser.first_name = req.body.first_name;
        newUser.last_name = req.body.last_name;
        newUser.referral_code = req.body.referral_code;
        newUser.mobile = req.body.mobile;
        newUser.email = req.body.email;
        newUser.password = req.body.password;
        await newUser.save()
        const token = jwt.sign({ userId: newUser._id }, jwtKey, {
            algorithm: algor,
            expiresIn: jwtExpirySeconds,
        })
        return res.status(200).json({
            message : 'Success',status : 200, data : {
                first_name : newUser.first_name !== null ? newUser.first_name : '',
                last_name :  newUser.last_name !== null ? newUser.last_name : '',
                referral_code : newUser.referral_code !== null ? newUser.referral_code : '',
                mobile : newUser.mobile !== null ? newUser.mobile : '',
                password : newUser.password !== null ? newUser.password : '',
                createdAt : newUser.createdAt !== null ? newUser.createdAt : '',
                updatedAt : newUser.updatedAt !== null ? newUser.updatedAt : '',
                _id : newUser._id,
                otp : newUser.otp !== null ? newUser.otp : '',
                isTrusted : newUser.isTrusted,
                banned : newUser.banned,
                isVerified : newUser.isVerified,
                role : newUser.role !== null ? newUser.role : '',
                email : newUser.email !== null ? newUser.email : '',
                token : token
            }
        })
    } catch (e) {
        return res.status(500).json({
            message: e.message, code: 500
        });
    }          
}

const verifyEmail = (req, res) => {
    User.findById(req.body._id, (err, user) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: err
            });
        }

        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Bad code'
            });
        }

        Verification.findOne({ code: req.params.code, owner: user._id }, (err, code) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: 'Bad code'
                });
            }

            if (!code) {
                return res.status(404).json({
                    success: false,
                    message: 'The code has expired'
                });
            }

            user.isVerified = true;
            if (user.isCoach && user.email.slice(-4) === '.edu') {
                user.isTrusted = true;
            }

            user.save(err => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err
                    });
                }

                res.json({
                    success: true
                });
            })
        })
    })
}

// const sendPasswordResetCode = (req, res) => {
//     User.findOne({ email: req.params.email }, (err, user) => {
//         if (user) {
//             const newVerification = new Verification({
//                 owner: user._id,
//                 code: _generateVerificationCode()
//             });

//             newVerification.save((err, verification) => {
//                 if (err) {
//                     throw new Error(err);
//                 }

//                 postman.send({
//                     to: user.email,
//                     subject: 'Reset your password | Recruited',
//                     template: 'reset-password',
//                     variables: [{
//                         name: 'code',
//                         value: verification.code
//                     }]
//                 }).then(() => {
//                     res.status(200);
//                 }).catch(err => {
//                     res.status(500).json({
//                         success: false,
//                         message: err
//                     });
//                 })
//             })
//         } else {
//             res.status(400).json({
//                 status: 400,
//                 message: 'The provided email address is not associated with any user.'
//             });
//         }
//     })
// }

const verifyPasswordResetCode = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err
            });
        }

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Bad code'
            });
        }

        Verification.findOne({ code: req.params.code, owner: user._id }, (err, code) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: 'Bad code'
                });
            }

            if (!code) {
                return res.status(404).json({
                    success: false,
                    message: 'The code has expired'
                });
            }

            return res.json({
                success: true
            });
        })
    })
}

const updatePassword = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        user.password = req.body.password;

        user.save((err, updatedUser) => {
            res.json({
                status: 200,
                message: "The user's password has been successfully updated!",
                updatedUser
            });
        })
    });
}


module.exports = {
    language,
    login,
    roles,
    register,
    // sendVerification,
    verifyEmail,
    // sendPasswordResetCode,
    verifyPasswordResetCode,
    updatePassword
};