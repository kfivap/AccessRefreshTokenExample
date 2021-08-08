const { unauthorized } = require('@hapi/boom');
const jwt = require('../libs/jwt');
const Auth = require('../schemas/Auth');

exports.authMiddleware = async (req, _res, next)=>{
    try {
    
        if (req.headers['x-access-token']) {
            const accessToken = req.headers['x-access-token'];
            const result = jwt.verifyAccessToken(accessToken);

            if (result.error) throw unauthorized(result.error);
            const tokenData = result.data;
            const userSession = (await Auth.findOne({userId: tokenData.userId}, {sessions:
                {$elemMatch: {accessToken}}
            }))?.sessions?.[0];

            if (!userSession) throw unauthorized('Seesion is closed');
            return next();
        }
        else throw unauthorized();
    } catch (e) {
        next(e);
    }
};