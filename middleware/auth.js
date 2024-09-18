const errorHandler = require('../utils/errorHandler')
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = function (req, res, next) {
    if(req.method === 'OPTIONS') {
        next()
    }
    try {

        const token = req.headers.authorization.split(' ')[1]
        if(!token) {
            return errorHandler(res, e)
        }
        const decodedData = jwt.verify(token, keys.jwt)
        req.user = decodedData;
        next()
    } catch (e) {
        errorHandler(res, e)
    }
}