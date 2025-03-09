import express from "express";
import cors from "cors";
import { MongoDB_URI, PORT } from "./constants.js";
import mongoose from "mongoose";
import userRoutes from "./routes/users.routes.js";
import channelRoutes from "./routes/channel.routes.js";
import videoRoutes from "./routes/videos.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(MongoDB_URI);

const db = mongoose.connection;

db.on("open", () => {
  console.log("MongoDB connected");
});

db.on("error", () => {
  console.log("MongoDB not connected");
});

app.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});

videoRoutes(app);
userRoutes(app);
channelRoutes(app);
