import {
  addComment,
  addNewVideo,
  deleteComment,
  editComment,
  fetchVideoById,
  fetchVideos,
  getAllComments,
} from "../controllers/video.controller.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";

function videoRoutes(app) {
  app.post("/api/video", addNewVideo);
  app.get("/api/videos", authMiddleware, fetchVideos);
  app.get("/api/video/:id", authMiddleware, fetchVideoById);
  app.get("/api/:videoId/comments", getAllComments);
  app.post("/api/:videoId/comment", addComment);
  app.put("/api/:videoId/comment/:commentId", editComment);
  app.delete("/api/:videoId/comment/:commentId", deleteComment);
}

export default videoRoutes;
