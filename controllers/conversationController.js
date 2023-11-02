import conversationModel from "../models/conversationModel.js";

export const createConversation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const exist = await conversationModel.findOne({ members: { $all: [senderId, receiverId] } });
        if (exist) {
            return res.status(201).json(exist);
        };

        const conversation = new conversationModel({ members: [senderId, receiverId] });
        await conversation.save();
        return res.status(201).json(conversation);
    } catch (e) {
        res.status(401).json(e);
    }
};

export const singleConversation = async (req, res) => {
    try {
        const senderId = req.body.senderId;
        const receiverId = req.body.receiverId;

        const exist = await conversationModel.findOne({ members: { $all: [senderId, receiverId] } });
        return res.status(201).json(exist);
    } catch (e) {
        res.status(401).json(e);
    };
};
