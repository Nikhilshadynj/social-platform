const userController = require('../controller/usersController');
const isAuthenticated = require('../../middleware/isAuthenticated');
const { body, validationResult } = require('express-validator');
const express = require('express')

const router = new express.Router()

router.get('/web_api/get-all-user',isAuthenticated, (req, res) => {
    userController.getAllUsers(req, res);
});

router.post('/web_api/login',(req,res)=>{
    userController.login(req,res)
})

module.exports = router