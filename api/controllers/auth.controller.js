import { User } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const authController = {
  async signUp(req, res) {
    try {
      const { pseudo, email, password } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ error: "Cet email est déjà utilisé" });
      }

      const hashedPassword = await argon2.hash(password);
      const newUser = await User.create({ pseudo, email, password: hashedPassword });

      res.status(StatusCodes.CREATED).json({
        id: newUser.id,
        pseudo: newUser.pseudo,
        email: newUser.email,
      });
    } catch (error) {
      console.error("Erreur inscription :", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Une erreur est survenue lors de l'inscription" });
    }
  },

  async signIn(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "Email ou mot de passe incorrect" });
      }

      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "Email ou mot de passe incorrect" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        message: "Connexion réussie",
        token,
        user: {
          id: user.id,
          pseudo: user.pseudo,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Erreur connexion :", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Une erreur est survenue lors de la connexion" });
    }
  },
};
