const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Role = require('../models/role');
const Language = require('../models/language');
const Verification = require('../models/Verification');
const utils = require('../lib/utils');
require('dotenv').config()
const UserMetaData = require('../models/user-metaData')
const fs = require('fs')
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
const login = async (req, res) => {
	User.findOne({ email: req.body.email }, async (err, user) => {
		if (user) {
			if (bcrypt.compareSync(req.body.password, user.password)) {
				if(user.gender !== null && user.location !== null && user.relationshipStatus !== null && user.selfIntroduction !== null && user.language !== null ){
					const token = await jwt.sign({ userId: user._id,role : user.role }, process.env.JWT_SECRET);
					res.json({
						status: 200,
						message: DM.SUCCESSFULL_LOGIN,
						data: {
							first_name: user.first_name !== null ? user.first_name : '',
							last_name: user.last_name !== null ? user.last_name : '',
							referral_code: user.referral_code !== null ? user.referral_code : '',
							mobile: user.mobile !== null ? user.mobile : '',
							password: user.password !== null ? user.password : '',
							createdAt: user.createdAt !== null ? user.createdAt : '',
							updatedAt: user.updatedAt !== null ? user.updatedAt : '',
							_id: user._id,
							otp: user.otp !== null ? user.otp : '',
							isTrusted: user.isTrusted,
							banned: user.banned,
							isVerified: user.isVerified,
							role: user.role !== null ? user.role : '',
							email: user.email !== null ? user.email : '',
							token: token,
							profileVerified : true,
							profile_image: user.profile_image !== null ? path.join(process.env.BASE_URL, 'profile-pictures' + '/' + user._id.toString() + '/' + user.profile_image) : '',
						}
					});
				}else{
					const token = jwt.sign({ userId: user._id,role : user.role }, process.env.JWT_SECRET);
					res.json({
						status: 200,
						message: DM.SUCCESSFULL_LOGIN,
						data: {
							first_name: user.first_name !== null ? user.first_name : '',
							last_name: user.last_name !== null ? user.last_name : '',
							referral_code: user.referral_code !== null ? user.referral_code : '',
							mobile: user.mobile !== null ? user.mobile : '',
							password: user.password !== null ? user.password : '',
							createdAt: user.createdAt !== null ? user.createdAt : '',
							updatedAt: user.updatedAt !== null ? user.updatedAt : '',
							_id: user._id,
							otp: user.otp !== null ? user.otp : '',
							isTrusted: user.isTrusted,
							banned: user.banned,
							isVerified: user.isVerified,
							role: user.role !== null ? user.role : '',
							email: user.email !== null ? user.email : '',
							token: token,
							profileVerified : false
						}
					});
				}
			} else {
				res.status(400).json({
					status: 400,
					message: DM.INCORRECT_PASSWORD,
					data: {}
				});
			}
		} else {
			res.status(400).json({
				status: 400,
				message: DM.USER_NOT_FOUND,
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
				message: DM.EMAIL_ALREADY_EXISTS
			});
		}
		const mobile = await User.findOne({ mobile: req.body.mobile })
		if (mobile) {
			return res.status(400).json({
				status: 400,
				message: DM.MOBILE_ALREADY_EXISTS
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
		const metaData = new UserMetaData({
			userId: newUser._id,
			privacy: false
		})
		await metaData.save()
		const token = await jwt.sign({ userId: newUser._id,role : newUser.role }, process.env.JWT_SECRET);
		return res.status(200).json({
			message: DM.SUCCESS, status: 200, data: {
				first_name: newUser.first_name !== null ? newUser.first_name : '',
				last_name: newUser.last_name !== null ? newUser.last_name : '',
				referral_code: newUser.referral_code !== null ? newUser.referral_code : '',
				mobile: newUser.mobile !== null ? newUser.mobile : '',
				password: newUser.password !== null ? newUser.password : '',
				createdAt: newUser.createdAt !== null ? newUser.createdAt : '',
				updatedAt: newUser.updatedAt !== null ? newUser.updatedAt : '',
				_id: newUser._id,
				otp: newUser.otp !== null ? newUser.otp : '',
				isTrusted: newUser.isTrusted,
				banned: newUser.banned,
				isVerified: newUser.isVerified,
				role: newUser.role !== null ? newUser.role : '',
				email: newUser.email !== null ? newUser.email : '',
				token: token
			}
		})
	} catch (e) {
		return res.status(500).json({
			message: e, status: 500
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
				message: DM.PASSWORD_UPDATED,
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
	verifyEmail,
	verifyPasswordResetCode,
	updatePassword
};