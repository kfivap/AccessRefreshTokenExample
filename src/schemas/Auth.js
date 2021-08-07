const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    accessToken: String, //

    sessions: [{
        refreshToken: String,
    }]

});

module.exports = mongoose.model('Auth', authSchema);
