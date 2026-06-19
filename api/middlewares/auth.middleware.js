import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token manquant" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Votre session a expiré, veuillez vous reconnecter" });
    }
    res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token invalide" });
  }
};
