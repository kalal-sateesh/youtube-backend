import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  commentId: String,
  userId: String,
  text: String,
  timestamp: Date,
});

mongoose.model("Comments", commentSchema);

export default commentSchema;
