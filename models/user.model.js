import mongoose from "mongoose";
import channelSchema from "./channel.model.js"

const userSchema = new mongoose.Schema({
  userId: String,
  username: String,
  email: String,
  password: String,
  avatar: String,
  channel: [channelSchema],
});

const userModel = mongoose.model("Users", userSchema);

export default userModel;
