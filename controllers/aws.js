const AWS = require('aws-sdk');
const User = require('../models/user');
require('dotenv').config()
var request = require('request').defaults({ encoding: null });
AWS.config.update({
	"accessKeyId": 'AKIAZBGUD2NXIUMR2V77',
	"secretAccessKey": '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',
	"region": process.env.REGION
})
const client = new AWS.Rekognition();

const check_photo_source = (req, res, callback) => {
	if (req.files) {
		return callback(req.files.sourceImage.data);
	} else {
		return res.status(400).json({
			message: 'Please provide image', status: 400, data: {}
		})
	}
}

const check_photo_target = async (req, res, callback) => {
	const user = await User.findById(req.body.userId)
	if (user) {
		if(user.profile_image){
			const profilePic = process.env.BASE_URL+'/'+ 'profile-pictures' + '/' + user._id.toString() + '/' + user.profile_image
			request.get(profilePic, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					let data = Buffer.from(body).toString('base64');
					const image = Buffer.from(data, 'base64')
					return callback(image)
				}
			});
		}else{
			return res.status(400).json({
				message : 'User does not have profile picture uploaded',status: 400, data : {}
			})
		}
	}else{
		return res.status(400).json({
			message : DM.USER_NOT_FOUND,status: 400, data : {}
		})
	}
}

const faceRecogitions = async (source, target, callback) => {
	const params = {
		'SourceImage': {
			Bytes: source,
		},
		'TargetImage': {
			Bytes: target,
		},
	}
	client.compareFaces(
		params, function (err, response) {
			if (err) {
				callback({ err: err.name }); // an error occurred
			} else {
				callback({ response: response });
			}
		});
}

module.exports = { faceRecogitions, check_photo_source, check_photo_target }