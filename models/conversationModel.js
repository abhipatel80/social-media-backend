import mongoose from 'mongoose';

const conversationSchema = mongoose.Schema({
    members: {
        type: Array
    },
    message: {
        type: String,
    },
}, { timestamps: true });

const conversationModel = mongoose.model('conversation', conversationSchema);

export default conversationModel;
