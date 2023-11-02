import express from 'express';
const router = express();
import { auth } from '../middleware/auth.js';
import upload from '../utils/upload.js';
import {
    allPosts,
    createPost,
    deletePost,
    myPosts,
    singlePost,
    updatePost
} from '../controllers/postController.js';
import { addComment, deleteComment } from '../controllers/commentController.js';
import { addLike, deleteLike, isLikedPosts, likedPosts } from '../controllers/likeController.js';
import { followingsPosts } from '../controllers/followController.js';

router.post("/add", auth, upload.single("postImage"), createPost);
router.put("/edit/:id", auth, updatePost);
router.delete("/delete/:id/:userId", auth, deletePost);

router.put('/comment', auth, addComment);
router.delete('/delcomment', auth, deleteComment);

router.put("/like/:postId", auth, addLike);
router.put("/delike/:postId", auth, deleteLike);
router.get("/liked/me/:id", auth, likedPosts);
router.get("/like/check/:postId", auth, isLikedPosts);

router.get("/get/me/:id", auth, myPosts);
router.get("/get", allPosts);
router.get("/get/:id", singlePost);

router.get("/following/:id", auth, followingsPosts);

export default router;
