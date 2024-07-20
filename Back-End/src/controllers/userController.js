import { NextFunction, Request, Response } from "express";
import cloudinary from "cloudinary";
import User from "../models/User";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

cloudinary.v2.config({
  cloud_name: "dy0f5bsqg",
  api_key: "279213121946535",
  api_secret: "iJzNDc8gEXBUQJCu2o6UbV7rsGg",
});

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;

    const uploadResponse = await cloudinary.v2.uploader.upload(file.path, {
      folder: "avatars",
    });

    if (uploadResponse.secure_url) {
      return res.status(200).json({
        message: "Avatar updated successfully",
        success: uploadResponse.secure_url,
      });
    } else {
      return res.status(400).json({
        message: "Error uploading Avatar",
        error: `An error occurred during the upload. Please check your network connection and try again.`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: `An unexpected error occurred during the upload. Please contact support if the issue persists.`,
    });
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const file = req.file;

    const uploadResponse = await cloudinary.v2.uploader.upload(file.path, {
      folder: "avatars",
    });
    if (uploadResponse.secure_url) {
      await User.findByIdAndUpdate(
        req.params.id,
        { avatarUrl: uploadResponse.secure_url },
        { new: true }
      );
      return res.status(200).json({
        message: "Avatar updated successfully",
        success: uploadResponse.secure_url,
      });
    } else {
      return res.status(400).json({
        message: "Error uploading Avatar",
        error: `An error occurred during the upload. Please check your network connection and try again.`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: `An unexpected error occurred during the upload. Please contact support if the issue persists.`,
    });
  }
};

export const createNewUser = async (req: Request, res: Response) => {
  try {
    const newUser = new User({
      username: "dummy",
      avatarUrl: null,
    });
    const user = await newUser.save();

    return user._id.toString();
  } catch (error) {
    console.error("Error creating new user:", error);
    throw error;
  }
};

export const getExistingUserDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  console.log(req);
  let userId = req?.cookies?.userId || null;
  let user;
  try {
    if (!userId) {
      user = await createNewUser(req, res);
    } else {
      user = await User.findById(userId);
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ userId: user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
