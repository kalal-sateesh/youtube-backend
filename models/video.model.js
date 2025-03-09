import mongoose from "mongoose";
import commentSchema from "./comment.model.js";

const videoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  thumbnailUrl: String,
  description: String,
  channelId: String,
  uploader: String,
  views: Number,
  likes: Number,
  dislikes: Number,
  uploadDate: Date,
  profileUrl: String,
  category: String,
  comments: [commentSchema],
});

const videoModel = mongoose.model("Videos", videoSchema);

export default videoModel;
