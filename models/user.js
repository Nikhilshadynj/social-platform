const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const User = new Schema({
    first_name: { type: String },
    last_name: { type: String },
    referral_code: { type: String },
    mobile: { type: String},
    email: { type: String, },
    password: { type: String },
    profile_image: { type: String,default : null },
    role: {
        ref: 'Role',
        type: String,
        default: 'user',
        enum: ["user", "celebrity", "admin","vip","guest"],
        lowercase : true
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    banned : {
        type : Boolean,
        default : false
    },
    isTrusted : {
        type : Boolean,
        default : false
    },
    otp : {
        type : String,
        default : null
    },
    otpTime : {
        type : String
    },
    location : {
        type : String,
        default : null
    },
    gender : {
        type : String,
        default : null
    },
    selfIntroduction : {
        type : String,
        default : null
    },
    interesedIn : {
        type : String,
        enum : ['men','women','others',null],
        default : null,
        lowercase : true
    },
    relationshipStatus : {
        type : String,
        enum : ['single','taken',null],
        default : null,
        lowercase : true
    },
    age : {
        type : String,
        default : null
    },
    friends : {
        type : String,
        default : '0'
    },
    followers : {
        type : Number,
        default : 0
    },
    followings : {
        type : Number,
        default : 0
    },
    language : {
        type : String,
        default : null
    },
    profileName : {
        type : String,
        default : null
    }
}, { timestamps: true });


User.pre('save', function(next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

module.exports = mongoose.model('User', User);