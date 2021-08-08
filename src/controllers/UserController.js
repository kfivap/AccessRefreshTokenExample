const User = require('../schemas/User');
const Auth = require('../schemas/Auth');
const jwt = require('../libs/jwt');
const {v4} = require('uuid');
const { badRequest, unauthorized, conflict } = require('@hapi/boom');

exports.register = async ({ login, password }) => {
    if (!login && !password) throw badRequest('no login or password');

    const exist = await User.findOne({login});
    if (exist) throw conflict('login already exist');
    const result = await User.create({
        login, password
    });
    await Auth.create({userId: result._id});
    return {data: result};
};

exports.login = async ({ login, password }) => {
    if (!login && !password) throw badRequest('no login or password');

    const user = await User.findOne({login, password});
    if (!user) {
        throw unauthorized('');
    }

    const sessionId = v4();
    const accessToken = jwt.signAccess({userId: user._id, sessionId});   
    const refreshToken = jwt.signRefresh({userId: user._id});

    await Auth.updateOne({userId: user._id}, 
        { 
            $push: { 'sessions': 
            [{sessionId, refreshToken, accessToken}] 
            }, 
        },
    );

    //for test
    const populate = await Auth.findOne({}).populate('userId');

    return {data: {
        populate
    }};

};

exports.refresh = async (token)=>{
    const userId = jwt.decode(token)?.userId;
    if (!userId) throw unauthorized();

    const userSession = (await Auth.findOne({userId}, {sessions:
    {$elemMatch: {refreshToken: token}}
    }))?.sessions?.[0];
    console.log('userSession', userSession);
    
    if (!userSession) throw unauthorized();
    // req.userSession = userSession._id;

    const result = jwt.verifyRefreshToken(token, userSession.refreshToken);
    if (result.error) throw unauthorized(result.error);

    const newRefreshToken = jwt.signRefresh({userId});
    const newAccessToken = jwt.signAccess({userId, sessionId: userSession.sessionId});

    await Auth.updateOne({userId, 'sessions.refreshToken': token }, {$set: {
        'sessions.$.refreshToken': newRefreshToken, }
    }, {
        arrayFilters: [{
            'sessions.refreshToken': token,
        }]
    }, function(err, res) {
        console.log(err, res);
    });

    return {
        data: {refreshToken: newRefreshToken, accessToken: newAccessToken, sessionId: userSession.sessionId}
    };
};

exports.clearAllSessions = async (token)=>{
    const tokenData = jwt.decode(token);
    console.log('tokenData', tokenData);

    await Auth.updateMany({userId: tokenData.userId}, { $pull: { sessions: { 'sessionId': {$ne: tokenData.sessionId} } }}, function(err, res) {
        console.log(err, res);
    });
    return {data: null};
};

