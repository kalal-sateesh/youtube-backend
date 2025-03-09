import {
  createChannel,
  fetchChannelById,
} from "../controllers/channel.controller.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";

function channelRoutes(app) {
  app.post("/api/channel", authMiddleware, createChannel);
  app.get("/api/channel/:id", authMiddleware, fetchChannelById);
}

export default channelRoutes;
