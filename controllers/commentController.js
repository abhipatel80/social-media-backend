import postModel from "../models/postModel.js";

// add comment to posts
export const addComment = async (req, res) => {
    try {
        const { comment, postId } = req.body;
        if (comment.split("").length <= 3) {
            return res.status(401).json("comment must be atleast 3 characters");
        }
        const data = {
            userId: req.user.id,
            name: req.user.username,
            comment,
        };

        let post = await postModel.findById(postId);
        post.comments.push(data);
        post.totalComments = post.comments.length;
        await post.save();
        res.status(201).json("Post commented successfully");

    } catch (e) {
        return res.status(401).json(e);
    }
}

// delete comment to posts
export const deleteComment =  async (req, res) => {
    try {
        const post = await postModel.findById(req.query.postId);
        if (!post) {
            return res.status(404).json("Post not found");
        };

        const comments = post.comments.filter((val) => {
            return val._id.toString() !== req.query.id.toString();
        });

        const totalComments = comments.length;

        await postModel.findByIdAndUpdate(req.query.postId, { comments, totalComments }, { new: true });

        res.status(201).json("Post comment deleted successfully");

    } catch (e) {
        return res.status(401).json(e);
    }
}