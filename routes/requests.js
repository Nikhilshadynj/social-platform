const requestsController = require('../controllers/requestController');
const isAuthenticated = require('../middleware/isAuthenticated');
const { body, validationResult } = require('express-validator');
const express = require('express')
const router = new express.Router()

router.post('/acceptRequest', [
	body('requestedId').not().trim().isEmpty().withMessage('RequestedId is required.'),
	body('requestingId').not().trim().isEmpty().withMessage('RequestingId is required.'),
], isAuthenticated, (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			status: 400,
			message: errors.array()[0].msg,
			data: {}
		});
	}
	requestsController.acceptRequest(req, res);
});
router.post('/declineRequest', [
	body('requestedId').not().trim().isEmpty().withMessage('RequestedId is required.'),
	body('requestingId').not().trim().isEmpty().withMessage('RequestingId is required.'),
], isAuthenticated, (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			status: 400,
			message: errors.array()[0].msg,
			data: {}
		});
	}
	requestsController.declineRequest(req, res);
});
module.exports = router