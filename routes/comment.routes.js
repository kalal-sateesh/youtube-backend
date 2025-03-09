import { addComment, getAllComments } from "../controllers/video.controller.js";

function commentRoutes(app) {
  app.post("/api/:videoId/comment", addComment);
  app.get("/api/:videoId/comments", getAllComments);
}

export default commentRoutes;
