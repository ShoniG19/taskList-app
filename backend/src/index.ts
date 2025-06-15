import express from "express";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import cors from "cors";
import path from "path";
import { verifyToken } from "./middlewares/auth.middleware";
import prisma from "./prisma";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      file?: Express.Multer.File;
    }
  }
}

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/api/me", verifyToken, async (req, res) => {
  const userId = req.userId ? Number(req.userId) : undefined;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, language: true, avatar: true, isActive: true, createdAt: true },
  });

  res.json(user);
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
