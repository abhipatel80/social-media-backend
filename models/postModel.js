import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    caption: {
        type: String,
        required: true,
        minlength: [10, "caption must be atleast 10 characters"],
        maxlength: [500, "caption not be greater than 500 characters"],
    },
    postImage: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    userName: {
        type: String,
        required: true
    },
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
            name: { type: String },
            comment: { type: String, minlength: 3 },
            createdAt: { type: Date, default: Date.now() },
        },
    ],
    likes: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId },
            name: { type: String },
        },
    ],
    totalComments: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 }
}, { timestamps: true });

const postModel = mongoose.model("Post", postSchema);

export default postModel;
