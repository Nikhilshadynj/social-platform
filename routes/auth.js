const authController = require('../controllers/authController');
const { check, body, validationResult } = require('express-validator');
const express = require('express')
const router = new express.Router()
    //Get Language
    router.get('/language', (req, res) => {
        authController.language(req, res);
    });

    // Get Roles
    router.get('/roles', (req, res) => {
        authController.roles(req, res);
    });

    // Login
    router.post('/login', [
        body('email').not().isEmpty().withMessage('Email field is required.').isEmail().withMessage('Email should be an valid email.').trim(),
        body('password').not().isEmpty().trim().isLength({ min: 6 })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: errors.array()[0].msg,
            });
        }
        authController.login(req, res);
    });

    // Register
    router.post('/register', [
        body('role').not().isEmpty().trim().withMessage('Role is required.'),
        body('first_name').not().trim().isEmpty().withMessage('First name is required.'),
        body('email').not().trim().isEmpty().withMessage('Email is required.').isEmail().withMessage('Email should be an valid email.'),
        body('password').not().trim().isEmpty().withMessage('Password is required.').isLength({ min: 6 }).withMessage('Password minimum length is 6.'),
        body('mobile').not().trim().isEmpty().withMessage('Mobile Number is required.')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: errors.array()[0].msg,
                data: {}
            });
        }
        authController.register(req, res);
    });

    // Verification Mail Send
    router.post('/verification/send', (req, res) => {
        authController.sendVerification(req, res);
    });

    //Verification Confirm
    router.post('/verification/confirm/:code', (req, res) => {
        authController.verifyEmail(req, res);
    });

    //Password Reset Mail Send
    router.post('/password-reset/send/:email', (req, res) => {
        authController.sendPasswordResetCode(req, res);
    });

    //Password Reset Confirm
    router.post('/password-reset/confirm/:code', (req, res) => {
        authController.verifyPasswordResetCode(req, res);
    });

    //Password Reset Save
    router.post('/password-reset/save', (req, res) => {
        authController.updatePassword(req, res);
    });

module.exports = router