import conversationModel from "../models/conversationModel.js";
import msgmodel from "../models/msgModel.js";

export const addMsg = async (req, res) => {
    try {
        const msg = await msgmodel.create(req.body);
        await conversationModel.findByIdAndUpdate(req.body.conversationId, { message: req.body.text });
        return res.status(201).json(msg);
    } catch (e) {
        return res.status(401).json(e);
    }
};

export const getSingleChatMsg = async (req, res) => {
    try {
        let conversationId = req.params.id;
        const msg = await msgmodel.find({ conversationId });
        return res.status(201).json(msg);
    } catch (e) {
        return res.status(401).json(e);
    }
}

export const deleteSingleMsg = async (req, res) => {
    try {
        await msgmodel.findByIdAndDelete(req.params.id);
        return res.status(200).json("message deleted successfully");
    } catch (e) {
        return res.status(401).json(e);
    }
}

export const clearChat = async (req, res) => {
    try {
        let conversationId = req.params.id;
        await msgmodel.deleteMany({ conversationId });
        return res.status(200).json("chat cleared successfully");
    } catch (e) {
        return res.status(401).json(e);
    }
}
