const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    sessions: [{
        sessionId: String,
        refreshToken: String,
        accessToken: String,
    }]

});

module.exports = mongoose.model('Auth', authSchema);
