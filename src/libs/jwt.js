
const jwt = require('jsonwebtoken');
const accessKey = '12345';
const refreshKey = '54321';

exports.decode = (token) =>{
    return jwt.decode(token);
};

exports.signAccess = ({userId, sessionId})=>{
    if (!userId) throw 'not found';
    return jwt.sign({ data: 'someData', type: 'access', userId, sessionId}, accessKey, {
        algorithm: 'HS256', expiresIn: '30m'
    });
};

exports.signRefresh = ({userId})=>{
    return jwt.sign({data: 'someData', type: 'refresh', userId}, refreshKey, {
        algorithm: 'HS256', expiresIn: '60d'
    });
};


exports.verifyAccessToken = (token)=>{
    const result = {};
    jwt.verify(token, accessKey, {
        algorithms: 'HS256'
    }, (err, verifyResult)=>{
        if (err) {
            result.error = err.message;
        }
        result.data = verifyResult;
    });
    return result;
};

exports.verifyRefreshToken = (token)=>{
    const result = {};
    jwt.verify(token, refreshKey, {
        algorithms: 'HS256'
    }, (err, verifyResult)=>{
        if (err) {
            result.error = err.message;
        }
        result.data = verifyResult;
    });
    return result;
};