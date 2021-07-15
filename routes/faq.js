const faqController = require('../controllers/faqController');
const isAuthenticated = require('../middleware/isAuthenticated');
const express = require('express')
const router = new express.Router()

    router.get('/faq', (req, res) => {
        faqController.getFaq(req, res);
    });

    router.post('/add-faq', (req, res) => {
        faqController.addFaq(req, res);
    });

    router.get('/edit-faq/:id', (req, res) => {
        faqController.editFaq(req, res);
    });

    router.post('/update-faq', (req, res) => {
        faqController.updateFaq(req, res);
    });

    module.exports = router