const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    var token = req.headers['x-access-token']
    if (!token) {
        return res.status(200).json({
            message: 'No token provided', code: 401, data: {}
        })
    }
    jwt.verify(token, 'secretkey', function (err, decoded) {
        if (err) {
            return res.status(403).json({
                status: 403,
                message: err.message
            });
        }
        if (decoded) {
            next();
        }
    });
}