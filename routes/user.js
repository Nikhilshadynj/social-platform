const userController = require('../controllers/userController');
const isAuthenticated = require('../middleware/isAuthenticated');
const { body, validationResult } = require('express-validator');
module.exports = app => {
    app.get('/get-all-user',isAuthenticated, (req, res) => {
        userController.getAllUsers(req, res);
    });

    app.get('/user-profile/:id',isAuthenticated, (req, res) => {
        userController.getCurrentUser(req, res);
    });

    app.put('/profile-update',[
        body('userId').not().trim().isEmpty().withMessage('user id is required')
    ], isAuthenticated, (req, res) => {
        userController.updateCurrentUser(req, res);
    });
    app.post('/update-profilePicture',[
        body('userId').not().trim().isEmpty().withMessage('user id is required')
    ],isAuthenticated,(req,res)=>{
        userController.updateProfilePicture(req,res)
    })
    app.post('/forget-password',[
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
    app.post('/verify-otp',[
        body('otp').not().trim().isEmpty().withMessage('Otp is required')
    ],(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: errors.array()[0].msg,
                data: {}
            });
        }
        userController.verifyOtp(req,res);
    })
    app.post('/change-password',[
        body('password').not().trim().isEmpty().withMessage('Password is required')
    ],(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: errors.array()[0].msg,
                data: {}
            });
        }
        userController.changePassword(req,res);
    })

    app.post('/follow-user',[
        body('sourceId').not().trim().isEmpty().withMessage('UserId is required'),
        body('destinationId').not().trim().isEmpty().withMessage('UserId is required')
    ],isAuthenticated,(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: errors.array()[0].msg,
                data: {}
            });
        }
        userController.followUser(req,res);
    })
    app.post('/upload-post',[
        body('userId').not().trim().isEmpty().withMessage('UserId is required')
    ],isAuthenticated,(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: errors.array()[0].msg,
                data: {}
            });
        }
        userController.addPost(req,res);
    })
    app.post('/homePage',[
        body('userId').not().trim().isEmpty().withMessage('UserId is required')
    ],isAuthenticated,(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: errors.array()[0].msg,
                data: {}
            });
        }
        userController.homePage(req,res);
    })
    app.post('/addLike',[
        body('userId').not().trim().isEmpty().withMessage('UserId is required'),
        body('postId').not().trim().isEmpty().withMessage('postId is required')
    ],isAuthenticated,(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: errors.array()[0].msg,
                data: {}
            });
        }
        userController.addLike(req,res);
    })
    app.post('/addComment',[
        body('userId').not().trim().isEmpty().withMessage('UserId is required'),
        body('postId').not().trim().isEmpty().withMessage('postId is required'),
        body('comment').not().trim().isEmpty().withMessage('comment is required'),
    ],isAuthenticated,(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: errors.array()[0].msg,
                data: {}
            });
        }
        userController.addComment(req,res);
    })

    app.post('/getComments',[
        body('postId').not().trim().isEmpty().withMessage('postId is required')
    ],isAuthenticated,(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: errors.array()[0].msg,
                data: {}
            });
        }
        userController.getComments(req,res);
    })
    app.post('/getReplies',[
        body('commentId').not().trim().isEmpty().withMessage('postId is required')
    ],isAuthenticated,(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: errors.array()[0].msg,
                data: {}
            });
        }
        userController.getReplies(req,res);
    })
    app.post('/unLike',[
        body('postId').not().trim().isEmpty().withMessage('postId is required'),
        body('userId').not().trim().isEmpty().withMessage('UserId is required')
    ],isAuthenticated,(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: errors.array()[0].msg,
                data: {}
            });
        }
        userController.unLike(req,res);
    })
    app.post('/unFollow',[
        body('sourceId').not().trim().isEmpty().withMessage('sourceId is required'),
        body('destinationId').not().trim().isEmpty().withMessage('destinationId is required')
    ],isAuthenticated,(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: errors.array()[0].msg,
                data: {}
            });
        }
        userController.unFollow(req,res);
    })
};