import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import { jsontoken } from "../utils/jwt.js";

// register user
export const register = async (req, res) => {
    try {
        let userImage;
        if (req?.file) {
            userImage = req?.file?.filename;
        }

        const { username, email, password } = req.body;
        if (!username || !email || !password || !userImage) {
            return res.status(401).json("Please fill all data");
        }

        const validate = validator.isEmail(email);
        if (!validate) {
            return res.status(401).json("Please enter valid email");
        }

        const findEmail = await userModel.findOne({ email });
        if (findEmail) {
            return res.status(401).json("User with this email already exists");
        }

        const findusername = await userModel.findOne({ username });
        if (findusername) {
            return res.status(401).json("Username already exists");
        }

        const bcrpass = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            username,
            email,
            password: bcrpass,
            userImage: "/userImages/" + userImage,
        });

        const token = await jsontoken(user._id);
        return res.status(200).json({ token, user });
    } catch (e) {
        return res.status(401).json(e);
    }
};

// login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json("Please fill all data");
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json("Email or Password are Incorrect");
        }

        const checkpass = await bcrypt.compare(password, user.password);
        if (!checkpass) {
            return res.status(401).json("Email or Password are Incorrect");
        }

        const token = await jsontoken(user._id);
        return res.status(200).json({ token, user });
    } catch (e) {
        return res.status(401).json(e);
    }
};

// get all users
export const allUsers = async (req, res) => {
    try {
        if (req.query.name) {
            const search = await userModel.find({
                username: { $regex: req.query.name, $options: "i" },
            });
            return res.status(201).json(search);
        }
        const data = await userModel.find();
        return res.status(201).json(data);
    } catch (e) {
        return res.status(401).json(e);
    }
};

// get single user
export const getSingleUser = async (req, res) => {
    try {
        const data = await userModel
            .findById(req.params.id)
            .populate("followers")
            .populate("following");
        res.status(201).json(data);
    } catch (e) {
        return res.status(401).json(e);
    }
};

// update user
export const updateUser = async (req, res) => {
    try {
        let userImage;
        if (req?.file) {
            userImage = req?.file?.filename;
        }

        const oldUser = await userModel.findById(req.params.id);

        const { bio } = req.body;
        if (bio.split("").length <= 10) {
            return res.status(401).json("bio must be atleast 10 characters");
        }

        if (bio.split("").length >= 200) {
            return res.status(401).json("bio not be greater than 200 characters");
        }

        const data = await userModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    userImage: "/userImages/" + userImage,
                    bio,
                },
            },
            { new: true }
        );
        fs.unlink(
            "E:/Encircle technology/9projects/social-media app/backend/public" +
            oldUser.userImage,
            (err) => {
                if (err) return console.log(err);
                console.log("userImage deleted successfully");
            }
        );
        return res.status(201).json(data);
    } catch (e) {
        return res.status(401).json(e);
    }
};

// logout user
export const logout = async (req, res) => {
    try {
        req.headers.authorization = "";
        res.status(201).json("Logout successfully");
    } catch (e) {
        return res.status(401).json(e);
    }
}


