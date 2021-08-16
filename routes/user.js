const userController = require('../controllers/userController');
const isAuthenticated = require('../middleware/isAuthenticated');
const { body, validationResult } = require('express-validator');
const express = require('express');
const isPermitted = require('../middleware/isPermitted');
const router = new express.Router()
const aws = require('aws-sdk')
const fs = require('fs');

router.get('/get-all-user', isAuthenticated, (req, res) => {
    userController.getAllUsers(req, res);
});

router.get('/', (req, res) => {
    res.send('Welcome')
})

router.get('/user-profile/:id', isAuthenticated, (req, res) => {
    userController.getCurrentUser(req, res);
});

router.put('/profile-update', [
    body('userId').not().trim().isEmpty().withMessage('user id is required')
], isAuthenticated, (req, res) => {
    userController.updateCurrentUser(req, res);
});
router.post('/update-profilePicture', [
    body('userId').not().trim().isEmpty().withMessage('user id is required')
], isAuthenticated, (req, res) => {
    userController.updateProfilePicture(req, res)
})
router.post('/forget-password', [
    body('email').not().trim().isEmpty().withMessage('Email is required.').isEmail().withMessage('Please enter a valid email.'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.forgetPassword(req, res);
});
router.post('/verify-otp', [
    body('otp').not().trim().isEmpty().withMessage('Otp is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.verifyOtp(req, res);
})
router.post('/change-password', [
    body('password').not().trim().isEmpty().withMessage('Password is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.changePassword(req, res);
})

router.post('/follow-user', [
    body('sourceId').not().trim().isEmpty().withMessage('UserId is required'),
    body('destinationId').not().trim().isEmpty().withMessage('UserId is required')
], isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.followUser(req, res);
})
router.post('/upload-post', [
    body('userId').not().trim().isEmpty().withMessage('UserId is required')
], isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.addPost(req, res);
})
router.post('/homePage', [
    body('userId').not().trim().isEmpty().withMessage('UserId is required')
], isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.homePage(req, res);
})
router.post('/homePageStory', [
    body('userId').not().trim().isEmpty().withMessage('UserId is required')
], isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.homePageStory(req, res);
})
router.get('/homePageForGuest', (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.homePageForGuest(req, res);
})
router.post('/addLike', [
    body('userId').not().trim().isEmpty().withMessage('UserId is required'),
    body('postId').not().trim().isEmpty().withMessage('postId is required')
], isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.addLike(req, res);
})
router.post('/addComment', [
    body('userId').not().trim().isEmpty().withMessage('UserId is required'),
    body('postId').not().trim().isEmpty().withMessage('postId is required'),
    body('comment').not().trim().isEmpty().withMessage('comment is required'),
], isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.addComment(req, res);
})

router.post('/getComments', [
    body('postId').not().trim().isEmpty().withMessage('postId is required')
], isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.getComments(req, res);
})
router.post('/getReplies', [
    body('commentId').not().trim().isEmpty().withMessage('postId is required')
], isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.getReplies(req, res);
})
router.post('/unLike', [
    body('postId').not().trim().isEmpty().withMessage('postId is required'),
    body('userId').not().trim().isEmpty().withMessage('UserId is required')
], isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.unLike(req, res);
})
router.post('/unFollow', [
    body('sourceId').not().trim().isEmpty().withMessage('sourceId is required'),
    body('destinationId').not().trim().isEmpty().withMessage('destinationId is required')
], isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.unFollow(req, res);
})
router.post('/comment-like', [
    body('commentId').not().trim().isEmpty().withMessage('commentId is required'),
    body('userId').not().trim().isEmpty().withMessage('userId is required')
], isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.addCommentLike(req, res);
})
router.post('/follower-list', [
    body('userId').not().trim().isEmpty().withMessage('userId is required')
], isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.followerList(req, res);
})
router.post('/following-list', [
    body('userId').not().trim().isEmpty().withMessage('userId is required')
], isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.followingList(req, res);
})
router.post('/usersProfile', [
    body('userId').not().trim().isEmpty().withMessage('userId is required')
], isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.usersProfile(req, res);
})
router.post('/faceCompare', isAuthenticated, (req, res) => {
    userController.FaceCompare(req, res)
})
router.post('/getLikes', [
    body('postId').not().trim().isEmpty().withMessage('postId is required')
], isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.getLikes(req, res);
})
router.post('/searchUser', [
    body('profileName').not().trim().isEmpty().withMessage('profileName is required')
], isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.searchUser(req, res);
})
router.post('/storiesOfUser', [
    body('id').not().trim().isEmpty().withMessage('Id is required')
], isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {}
        });
    }
    userController.storiesOfUser(req, res);
})
module.exports = router