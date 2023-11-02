import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";

// follow user
export const followUser = async (req, res) => {
    const { followerId } = req.params;
    const userId = req.user.id;

    try {
        if (followerId === userId) {
            return res.status(404).json("You are not allow to follow yourself");
        }

        const follower = await userModel.findOneAndUpdate(
            { _id: followerId },
            { $addToSet: { followers: userId } },
            { new: true }
        );

        const following = await userModel.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { following: followerId } },
            { new: true }
        );

        if (!follower || !following) {
            return res.status(404).json("User not found");
        }

        res.status(201).json({ message: "Followed successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error following user" });
    }
};

// unfollow user
export const unfollowUser = async (req, res) => {
    const { followerId } = req.params;
    const userId = req.user.id;

    try {

        const follower = await userModel.findOneAndUpdate(
            { _id: followerId },
            { $pull: { followers: userId } },
            { new: true }
        );

        const following = await userModel.findOneAndUpdate(
            { _id: userId },
            { $pull: { following: followerId } },
            { new: true }
        );

        if (!follower || !following) {
            return res.status(404).json("User not found");
        }

        res.status(201).json({ message: "Unfollowed successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error unfollowing user" });
    }
}

// check user isFollowing or not
export const isUserFollowing = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);

        const isFollow = await user.following.map((val) => {
            return val.toString() === req.params.id;
        });

        return res.status(200).json(isFollow.includes(true) ? true : false);
    } catch (e) {
        return res.status(500).json(e);
    }
}

// get followings post 
export const followingsPosts = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        const followingId = user.following.map(val => val._id);
        const data = await postModel.find({ userId: { $in: followingId } }).populate("userId", "username userImage");
        return res.status(201).json(data);
    } catch (e) {
        return res.status(401).json(e);
    }
}