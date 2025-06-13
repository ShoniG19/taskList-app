import express from "express";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import cors from "cors";
import { verifyToken } from "./middlewares/auth.middleware";
import prisma from "./prisma";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.get("/api/me", verifyToken, async (req, res) => {
  const userId = req.userId ? Number(req.userId) : undefined;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });

  res.json(user);
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
