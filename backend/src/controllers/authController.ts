import authService from "@/services/authService";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const { user } = await authService.loginUser(email, password); // REVIEW - mudar desestruturação

    const access_token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "lax",
      maxAge: 7200000,
      path: "/",
    });

    res.json({ message: "Login successful", access_token, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
export const loginClient = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const { user } = await authService.loginClient(email, password); // REVIEW - mudar desestruturação

    const access_token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "lax",
      maxAge: 7200000,
      path: "/",
    });

    res.json({ message: "Login successful", access_token, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("access_token", "", { maxAge: 0 });
  res.json({ message: "Success logout" });
};
