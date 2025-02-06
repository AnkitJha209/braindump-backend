import express, { Request, response, Response } from "express";
import { Content, User } from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "./middleware.js";
import mongoose, { mongo } from "mongoose";

export const route = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// ---- user routes -----

route.post(
  "/auth/signup",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({ message: "Username and Password are required" });
        return;
      }
      const alreadyExist = await User.findOne({ username });
      if (alreadyExist) {
        res.status(401).json({
          message: "User with this name already exist",
        });
        return;
      }
      const hashPass = await bcrypt.hash(password, 10);
      await User.create({
        username,
        password: hashPass,
      });
      res.status(200).json({
        success: true,
        message: "Account Created Successfully",
      });
      return;
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error while Signing up",
      });
      return;
    }
  }
);

route.post(
  "/auth/login",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(401).json({
          success: false,
          message: "Both field username and password required",
        });
        return;
      }
      const existOrNot = await User.findOne({ username });
      if (!existOrNot) {
        res.status(404).json({
          success: false,
          message: "User not found with this username",
        });
        return;
      }
      if (await bcrypt.compare(password, existOrNot.password)) {
        const payload = {
          id: existOrNot._id,
        };
        const token = jwt.sign(payload, "JWT_SECRET", {
          expiresIn: "3d",
        });
        res.status(200).json({
          success: true,
          msg: "Log In Successfully",
          token,
        });
        return;
      } else {
        res.status(401).json({
          success: false,
          message: "Wrong Password",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error while logging in",
      });
      return;
    }
  }
);

// ------- content routes

route.post("/create-content", auth, async (req: AuthRequest, res: Response) => {
  try {
    const { link, type, title } = req.body;
    const { id } = req.user;
    console.log(id);
    console.log(link);
    console.log(type);
    console.log(title);
    if (!link || !type || !title) {
      res.status(401).json({
        success: false,
        message: "Need all the details",
      });
      return;
    }
    const UID = new mongoose.Types.ObjectId(id);

    const user = await User.findById({ _id: UID });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User Not found",
      });
      return;
    }

    const content = await Content.create({
      link,
      title,
      type,
      userId: UID,
    });

    res.status(200).json({
      success: true,
      message: "Content Added Successfully",
      content,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Could not create content",
    });
    return;
  }
});

route.get("/content", auth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.user;
    const uID = new mongoose.Types.ObjectId(id);
    const contents = await Content.find({ userId: uID }).populate("tag").exec();
    if (!contents) {
      res.status(404).json({
        success: false,
        message: "NO content found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Content fetched",
      contents,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot get content",
    });
  }
});

route.get("/get-content/:id", auth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const uID = mongoose.Types.ObjectId.createFromHexString(id);
    const userUID = mongoose.Types.ObjectId.createFromHexString(userId);

    const content = await Content.findById({ _id: uID }).populate("tag").exec();

    if (!content) {
      res.status(404).json({
        success: false,
        message: "No content found",
      });
      return;
    }

    if (content?.userId !== userUID) {
      res.status(401).json({
        success: false,
        message: "Not Accessible",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Content Fetched",
      content,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Cannot get the content",
    });
    return;
  }
});

route.delete(
  "/delete-content",
  auth,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.body;
      const userId = req.user.id;
      if (!id) {
        res.status(404).json({
          success: false,
          message: "Need Id to delete the content",
        });
        return;
      }
      const UID = mongoose.Types.ObjectId.createFromHexString(id);
      const userUID = mongoose.Types.ObjectId.createFromHexString(userId);
      const content = await Content.findById(UID);
      if (!content) {
        res.status(404).json({
          success: false,
          message: "No Content found",
        });
        return;
      }
      if (userUID.toString() !== content.userId.toString()) {
        res.status(401).json({
          success: false,
          message: "Not authorized to delete the content",
        });
        return;
      }
      await Content.findByIdAndDelete(UID);
      res.status(200).json({
        success: true,
        message: "Content Delete Successfully",
      });
      return;
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Cannot delete content",
      });
      return;
    }
  }
);
