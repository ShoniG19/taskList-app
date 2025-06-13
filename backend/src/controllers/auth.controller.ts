import { Request, Response, RequestHandler } from "express";
import prisma from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "s3Cr3t_K3y";

export const register: RequestHandler = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) res.status(400).json({ message: "Usuario ya registrado." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar", error });
  }
};

export const login: RequestHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ userId: user.id, name: user.name }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error en login", error });
  }
};

export const updateUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId ? Number(req.userId) : undefined;
  const { name, email, language, avatar } = req.body;
  console.log("userId:", userId);
  if (!userId) {
    res.status(401).json({ message: "Usuario no autenticado" });
    return;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, language, avatar },
    });

    res.json({
      email: updatedUser.email,
      name: updatedUser.name,
      language: updatedUser.language,
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
};

export const updatePassword: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId ? Number(req.userId) : undefined;

  const { currentPassword, newPassword } = req.body;
  if (!userId) {
    res.status(401).json({ message: "Usuario no autenticado" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      res.status(400).json({ message: "Contraseña actual incorrecta" });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar contraseña", error });
  }
};

export const deleteUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId ? Number(req.userId) : undefined;
  console.log("userId:", userId);
  if (!userId) {
    res.status(401).json({ message: "Usuario no autenticado" });
    return;
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};
