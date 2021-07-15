const Faq = require('../models/faq');
const mongoose = require('mongoose');
require('dotenv')

const getFaq = (req, res) => {
    Faq.find({}, (err, faq) => {
        if(err) {
            res.json({
                status: 500, 
                message: "Something went wrong!",
                data: {}
            });
        }else{
            if(faq){
                res.json({
                    status: 200,
                    message: "Success.",
                    data: faq
                });
            }else{
                res.json({
                    status: 400,
                    message: "No data found.",
                    data: {}
                });
            }
        }
    });
};

const addFaq = (req, res) => {
    const newFaq = new Faq();
    newFaq.question = req.body.question;
    newFaq.answer = req.body.answer;

    newFaq.save((err, faq) => {
        if (err) {
            res.json({
                status: 500,
                message: 'Something went wrong !',
                data: err.message
            });
        } else {
            res.json({
                status: 200,
                message: 'Faq added successfully.',
                data: { faq }
            });
        }
    });
};

const editFaq = (req, res) => {
    Faq.findById(req.params.id, (err, faq) => {
        if (err) {
            res.json({
                status: 500,
                message: 'Something went wrong!',
                data: {}
            });
        }else{
            if(faq){
                res.json({
                    status: 200,
                    message: 'Success!',
                    data: faq
                });
            }
        }
    });
};

const updateFaq = (req, res) => {
    Faq.findByIdAndUpdate(req.body.faqId, req.body, { new: true }, (err, faq) => {
        if (err) {
            res.json({
                status: 500,
                message: 'Something went wrong!',
                data: {}
            });
        }else{
            if(faq){
                res.json({
                    status: 200,
                    message: 'Success!',
                    data: faq
                });
            }
        }
    });
};

module.exports = {
    getFaq,
    addFaq,
    editFaq,
    updateFaq,
};