import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    userImage: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    bio: {
        type: String,
        minlength: [10, "bio must be atleast 10 characters"],
        maxlength: [200, "bio not be greater than 200 characters"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
