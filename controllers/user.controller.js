import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_TOKEN } from "../constants.js";
import { v4 as uuidv4 } from "uuid";

export function registerUser(req, res) {
  const { userId, username, email, password, avatar, channel } = req.body;
  userModel
    .findOne({ email })
    .then((data) => {
      if (data) {
        return res.status(403).json({ message: "User already exist" });
      } else {
        const newUser = new userModel({
          userId,
          username,
          email,
          password: bcrypt.hashSync(password, 10),
          avatar,
          channel,
        });
        newUser
          .save()
          .then((data) => {
            return res.status(201).json(data);
          })
          .catch((err) => res.status(500).json({ message: err.message }));
      }
    })
    .catch((err) => res.status(500).json({ message: err.message }));
}

export function loginUser(req, res) {
  const { email, password } = req.body;

  userModel
    .findOne({ email })
    .then((data) => {
      if (!data) {
        return res.status(404).json({ message: "User not found" });
      }
      const validPassword = bcrypt.compareSync(password, data.password);
      if (!validPassword) {
        return res.status(403).json({ message: "Invalid Credentials" });
      }
      const token = jwt.sign(
        { id: data._id, username: data.username },
        JWT_TOKEN,
        { expiresIn: "1hr" }
      );
      res.json({ data, accessToken: token });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
}

export function verifyToken(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ valid: false, message: "No token provided" });

  jwt.verify(token, JWT_TOKEN, (err, decoded) => {
    if (err)
      return res.status(401).json({ valid: false, message: "Invalid token" });
    res.json({ valid: true, username: decoded.username });
  });
}

export function fetchAllUsers(req, res) {
  userModel
    .find()
    .then((data) => {
      if (!data) {
        return res.status(404).json({ message: "Data not found" });
      }
      res.json(data);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
}

export function fetchUserById(req, res) {
  const _id = req.params.id;
  userModel
    .findOne({ _id })
    .then((data) => {
      if (!data) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(data);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
}

export async function createChannel(req, res) {
  try {
    const { channelName, owner, description, channelBanner } = req.body;

    if (!channelName || !owner || !description || !channelBanner) {
      return res.status(400).json({
        message:
          "channelName,owner,description,channelBanner are required",
      });
    }

    const user = await userModel.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newChannel = {
      channelId: uuidv4(),
      channelName,
      owner,
      description,
      channelBanner,
      subscribers: Math.floor(Math.random() * 100),
      videos: [],
    };

    user.channel.push(newChannel);
    await user.save();

    res.status(201).json(newChannel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function addVideoInChannel(req, res) {
  try {
    const { title, thumbnailUrl, description } = req.body;

    if (!title || !thumbnailUrl || !description) {
      return res
        .status(400)
        .json({ message: "title,thumbnailUrl and description are required" });
    }

    const user = await userModel.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newVideo = {
      videoId: uuidv4(),
      title,
      thumbnailUrl,
      description,
      uploader: user.username,
      views: Math.floor(Math.random() * 10000),
      likes: Math.floor(Math.random() * 100),
      dislikes: Math.floor(Math.random() * 10),
      uploadDate: new Date(),
      comments: [],
    };

    user.channel[0].videos.push(newVideo);
    await user.save();

    res.status(201).json(newVideo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function editVideoInChannel(req, res) {
  try {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "title and description are required" });
    }

    const user = await userModel.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const video = user.channel[0].videos.find((v) => v.videoId === videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    video.title = title;
    video.description = description;

    user.markModified("channel");
    await user.save();

    res.status(200).json({ message: "Video updated successfully", video });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteVideoInChannel(req, res) {
  try {
    const { videoId } = req.params;

    const user = await userModel.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const initialLength = user.channel[0].videos.length;
    user.channel[0].videos = user.channel[0].videos.filter(
      (v) => v.videoId !== videoId
    );
    if (user.channel[0].videos.length === initialLength) {
      return res.status(404).json({ message: "Video not found" });
    }

    user.markModified("channel");
    await user.save();

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export function getAllVideosInChannel(req, res) {
  const _id = req.params.id;
  userModel
    .findOne({ _id })
    .then((data) => {
      if (!data) {
        return res.status(400).json({ message: "User not found" });
      }
      res.json(data.channel);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
}
