const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
}, { timestamps: true });

const UserModel = mongoose.model('UserChat', UserSchema);
module.exports = UserModel;