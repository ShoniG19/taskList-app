import { Request, Response, RequestHandler, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "s3Cr3t_K3y";

interface AuthRequest extends Request {
  userId?: number; 
}

export const verifyToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const authReq = req as AuthRequest;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token no proporcionado" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try{
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    authReq.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};
