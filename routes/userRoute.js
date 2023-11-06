import express from "express";
const router = express();
import { auth } from "../middleware/auth.js";
import upload from "../utils/upload.js";
import {
  allUsers,
  getSingleUser,
  login,
  logout,
  register,
  updateUser,
} from "../controllers/userController.js";
import {
  followUser,
  isUserFollowing,
  unfollowUser,
} from "../controllers/followController.js";

router.post("/register", upload.single("userImage"), register);
router.post("/login", login);
router.delete("/logout", auth, logout);

router.get("/", auth, allUsers);
router.get("/:id", auth, getSingleUser);
router.put("/edit/:id", auth, upload.single("userImage"), updateUser);

router.put("/follow/:followerId", auth, followUser);
router.put("/unfollow/:followerId", auth, unfollowUser);
router.get("/following/:id", auth, isUserFollowing);

export default router;
