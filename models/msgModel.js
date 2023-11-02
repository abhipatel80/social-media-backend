import mongoose from 'mongoose';

const msgSchema = mongoose.Schema({
    senderId: { type: String },
    receiverId: { type: String },
    conversationId: { type: String },
    type: { type: String },
    text: { type: String },
}, { timestamps: true });

const msgmodel = mongoose.model("message", msgSchema);

export default msgmodel;
