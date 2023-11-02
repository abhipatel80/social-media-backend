import express from "express";
import fs from "fs";
const router = express();
import userModel from "../models/userModel.js";
import { auth } from "../middleware/auth.js";
import { userImgupload } from "../utils/upload.js";
import { allUsers, getSingleUser, login, logout, register, updateUser } from "../controllers/userController.js";
import { followUser, isUserFollowing, unfollowUser } from "../controllers/followController.js";

router.post("/register", userImgupload.single("userImage"), register);
router.post("/login", login);
router.delete("/logout", auth, logout);

router.get("/", auth, allUsers);
router.get("/:id", auth, getSingleUser);
router.put("/edit/:id", auth, userImgupload.single("userImage"), updateUser);

router.put("/follow/:followerId", auth, followUser);
router.put("/unfollow/:followerId", auth, unfollowUser);
router.get("/following/:id", auth, isUserFollowing);

export default router;
