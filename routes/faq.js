const faqController = require('../controllers/faqController');
const isAuthenticated = require('../middleware/isAuthenticated');

module.exports = app => {
    app.get('/faq', (req, res) => {
        faqController.getFaq(req, res);
    });

    app.post('/add-faq', (req, res) => {
        faqController.addFaq(req, res);
    });

    app.get('/edit-faq/:id', (req, res) => {
        faqController.editFaq(req, res);
    });

    app.post('/update-faq', (req, res) => {
        faqController.updateFaq(req, res);
    });
};