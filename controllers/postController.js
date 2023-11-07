import postModel from "../models/postModel.js";
import getDatauri from "../utils/dataUri.js";
import { uploader } from "../utils/cloudinaryConfig.js";

// create new post
export const createPost = async (req, res) => {
  try {
    let postImage;
    if (req?.file) {
      const file = getDatauri(req.file);
      const uploadFile = await uploader.upload(file.content);
      postImage = uploadFile.secure_url;
    }

    const { caption } = req.body;
    if (!caption || !postImage) {
      return res.status(400).json("Please fill all data");
    }
    if (caption.split("").length <= 10) {
      return res.status(401).json("caption must be atleast 10 characters");
    }
    const data = await postModel.create({
      caption,
      postImage,
      userId: req.user.id,
      userName: req.user.username,
    });
    return res.status(201).json(data);
  } catch (e) {
    return res.status(401).json(e);
  }
};

// get my posts
export const myPosts = async (req, res) => {
  try {
    const post = await postModel
      .find({ userId: req.params.id })
      .populate("userId", "username userImage");
    return res.status(201).json(post);
  } catch (e) {
    return res.status(401).json(e);
  }
};

// get single post
export const singlePost = async (req, res) => {
  try {
    const post = await postModel
      .findById(req.params.id)
      .populate("userId", "username userImage")
      .populate({
        path: "comments.userId",
        select: "userImage",
        model: "User",
      });
    return res.status(201).json(post);
  } catch (e) {
    return res.status(401).json(e);
  }
};

// get all posts
export const allPosts = async (req, res) => {
  try {
    const { page } = req.query;
    const skip = (page - 1) * 2;
    const data = await postModel
      .find()
      .populate("userId", "username userImage");
    // .skip(skip)
    // .limit(2)
    return res.status(201).json(data);
  } catch (e) {
    return res.status(401).json(e);
  }
};

// update post
export const updatePost = async (req, res) => {
  try {
    const data = await postModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          caption: req.body.caption,
        },
      },
      { new: true }
    );

    return res.status(201).json(data);
  } catch (e) {
    return res.status(401).json(e);
  }
};

// delete post
export const deletePost = async (req, res) => {
  try {
    await postModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.params.userId,
    });
    return res.status(201).json("Post deleted successfully");
  } catch (e) {
    return res.status(401).json(e);
  }
};
