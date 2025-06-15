import { Request, Response, RequestHandler } from "express";
import prisma from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../email/sendGrid";


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
  const { name, email, language } = req.body;
  
  if (!userId) {
    res.status(401).json({ message: "Usuario no autenticado" });
    return;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, language },
    });

    res.json({
      email: updatedUser.email,
      name: updatedUser.name,
      language: updatedUser.language,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
};

export const uploadAvatar: RequestHandler = async (req, res):Promise<void> => {
  const userId = req.userId ? Number(req.userId) : undefined;
  
  if (!userId || !req.file) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }

  try {
     const avatarUrl = (req.file as Express.Multer.File).path;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    });

    res.status(200).json({ avatar: updatedUser.avatar });
  } catch (error) {
    res.status(500).json({ message: "Error uploading avatar", error });
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

export const forgotPassword = async (req: Request, res: Response):Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email es requerido." });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    res.status(404).json({ message: "No se encontró un usuario con ese email." });
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: token,
      resetTokenExpires: expires,
    },
  });

  const resetLink = `http://localhost:5173/reset-password?token=${token}`;
  
  // Configura tu transporte
  await sendEmail({
    to: email,
    subject: "Recuperación de contraseña",
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Password Reset</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f7f7f7;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 500px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              padding: 30px;
            }
            .header {
              text-align: center;
              color: #333;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              margin: 20px 0;
              background-color: #10b981;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            }
            .footer {
              font-size: 12px;
              color: #999;
              text-align: center;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="header">Recuperación de contraseña</h2>
            <p>Hola,</p>
            <p>Recibimos una solicitud para restablecer tu contraseña. Si fuiste tú, haz clic en el siguiente botón:</p>
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Restablecer contraseña</a>
            </div>
            <p>Este enlace caducará en 1 hora.</p>
            <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
            <div class="footer">
              © 2025 TaskList. Todos los derechos reservados.
            </div>
          </div>
        </body>
      </html>
    `,
  });

  res.status(200).json({ message: "Correo de recuperación enviado." });
};

export const resetPassword: RequestHandler = async (req, res):Promise<void> => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    res.status(400).json({ message: "Token y nueva contraseña requeridos" });
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() },
      },
    });

    if (!user) {
      res.status(400).json({ message: "Token inválido o expirado" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al restablecer contraseña", error });
  }
};