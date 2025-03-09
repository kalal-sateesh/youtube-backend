import jwt from "jsonwebtoken";
import { JWT_TOKEN } from "../constants.js";
import userModel from "../models/user.model.js";

export function authMiddleware(req, res, next) {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, JWT_TOKEN, function (err, verified) {
      if (err) {
        return res.status(403).json({ message: "Invalid Token" });
      }
      userModel
        .findById(verified._id)
        .then((user) => {
          req.user = user;
          next();
        })
        .catch((err) => res.status(500).json({ message: err.message }));
    });
  } else {
    return res.status(404).json({ message: "Authorization required" });
  }
}
