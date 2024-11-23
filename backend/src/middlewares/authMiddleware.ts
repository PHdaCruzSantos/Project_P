import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || ""; //TODO - Add JWT_SECRET to .env

export interface AuthRequest extends Request {
  userId?: number;
}

interface TokenPayload extends JwtPayload {
  userId: number;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.access_token;
    if (!token) {
      res.status(401).json({ message: "Token não fornecido" });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({ message: "Token inválido ou expirado" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Erro interno do servidor" });
    return;
  }
};
