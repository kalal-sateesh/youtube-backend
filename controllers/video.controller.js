import videoModel from "../models/video.model.js";
import { v4 as uuidv4 } from "uuid";

export function addNewVideo(req, res) {
  const {
    title,
    thumbnailUrl,
    description,
    uploader,
    views,
    likes,
    dislikes,
    comments,
    profileUrl,
    category,
  } = req.body;
  const newVideo = new videoModel({
    title,
    thumbnailUrl,
    description,
    channelId: uuidv4(),
    uploader,
    views,
    likes,
    dislikes,
    uploadDate: new Date(),
    comments,
    profileUrl,
    category,
  });
  newVideo
    .save()
    .then((data) => {
      if (!data) {
        return res.status(400).json({ message: "Something went wrong" });
      }
      res.json(data);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
}

export function fetchVideos(req, res) {
  videoModel
    .find()
    .then((data) => {
      if (!data) {
        return res.status(404).json({ message: "Data not found" });
      }
      res.json(data);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
}

export function fetchVideoById(req, res) {
  const _id = req.params.id;
  videoModel
    .findOne({ _id })
    .then((data) => {
      if (!data) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(data);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
}

export function getAllComments(req, res) {
  const _id = req.params.videoId;
  videoModel
    .findOne({ _id })
    .then((data) => {
      if (!data) {
        return res.status(400).json({ message: "Video not found" });
      }
      res.json(data.comments);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
}

export async function addComment(req, res) {
  try {
    const { userId, text } = req.body;

    if (!userId || !text) {
      return res
        .status(400)
        .json({ message: "User ID and comment text are required" });
    }

    const video = await videoModel.findOne({ _id: req.params.videoId });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const newComment = {
      commentId: uuidv4(),
      userId,
      text,
      timestamp: new Date(),
    };

    video.comments.unshift(newComment);
    await video.save();

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function editComment(req, res) {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "comment text required" });
    }

    const video = await videoModel.findOne({ _id: req.params.videoId });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    const comment = video.comments.find((c) => c.commentId === commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.text = text;
    video.markModified("comments");
    await video.save();

    res.status(200).json({ message: "Comments updated successfully", comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;

    const video = await videoModel.findOne({ _id: req.params.videoId });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const updatedComments = video.comments.filter(
      (c) => c.commentId !== commentId
    );

    video.comments = updatedComments;
    video.markModified("comments");
    await video.save();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
