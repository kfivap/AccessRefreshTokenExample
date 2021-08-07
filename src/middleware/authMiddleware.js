const { unauthorized } = require('@hapi/boom');
const jwt = require('../libs/jwt');
const Auth = require('../schemas/Auth');

exports.authMiddleware = async (req, _res, next)=>{
    try {
    
        // if (req.headers['x-refresh-token']) {

        // }
        if (req.headers['x-access-token']) {
            const token = req.headers['x-access-token'];
            const result = jwt.verifyAccessToken(token);
            if (result.error) throw unauthorized(result.error);
            return next();
        }

        else throw unauthorized();

    } catch (e) {
        next(e);
    }
};