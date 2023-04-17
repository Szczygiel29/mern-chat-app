const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserChat'
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserChat'
    },
    text: String,
}, 
{
    timestamps: true
});

const MessageModel = mongoose.model('Message', MessageSchema);
module.exports = MessageModel;
