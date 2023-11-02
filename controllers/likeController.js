import postModel from "../models/postModel.js";

// add like to posts
export const addLike = async (req, res) => {
    try {
        const data = {
            userId: req.user.id,
            name: req.user.username,
        };

        let post = await postModel.findById({ _id: req.params.postId });

        const isLike = await post.likes.map((val) => {
            return val.userId.toString() === data.userId;
        });

        if (isLike.includes(true)) {
            return res.status(400).json("You already liked this post");
        } else {
            post.likes.push(data);
            post.totalLikes = post.likes.length;
            await post.save();
            res.status(201).json("Post Liked successfully");
        }
    } catch (e) {
        return res.status(401).json(e);
    }
}

// delete like to posts
export const deleteLike = async (req, res) => {
    try {
        let post = await postModel.findById({ _id: req.params.postId });

        const like = post.likes.filter((val) => {
            return val.userId.toString() !== req.query.id.toString();
        });

        const totalLikes = like.length;

        await postModel.findByIdAndUpdate({ _id: req.params.postId }, { likes: like, totalLikes }, { new: true });

        res.status(201).json("Post Like deleted successfully");

    } catch (e) {
        return res.status(401).json(e);
    }
}

// get liked post
export const likedPosts = async (req, res) => {
    try {
        const data = await postModel.find({ likes: { $elemMatch: { userId: req.params.id } } }).populate("userId", "username userImage");
        return res.status(201).json(data);
    } catch (e) {
        return res.status(401).json(e);
    };
};

// check post is Liked or not by loggedIn user
export const isLikedPosts = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;
        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(401).json("Post not found");
        }

        const isLike = await post.likes.map((val) => {
            return val.userId.toString() === userId;
        });

        res.status(200).json(isLike.includes(true) ? true : false);
    } catch (e) {
        return res.status(401).json(e);
    };
};
