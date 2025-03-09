import {
  addVideoInChannel,
  createChannel,
  deleteVideoInChannel,
  editVideoInChannel,
  fetchAllUsers,
  fetchUserById,
  getAllVideosInChannel,
  loginUser,
  registerUser,
  verifyToken,
} from "../controllers/user.controller.js";
// import { authMiddleware } from "../middlewares/authmiddleware.js";

function userRoutes(app) {
  app.post("/api/register", registerUser);
  app.post("/api/login", loginUser);
  app.post("/api/verifyToken", verifyToken);
  app.get("/api/user/:id", fetchUserById);
  app.get("/api/users", fetchAllUsers);
  app.post("/api/:id/channel", createChannel);
  app.get("/api/:id/channel", getAllVideosInChannel);
  app.post("/api/:id/addVideo", addVideoInChannel);
  app.put("/api/channel/:id/video/:videoId", editVideoInChannel);
  app.delete("/api/channel/:id/video/:videoId", deleteVideoInChannel);
}

export default userRoutes;
