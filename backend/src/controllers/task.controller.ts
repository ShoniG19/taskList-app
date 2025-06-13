import { Request, Response, RequestHandler } from "express";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export const createTask: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { title } = req.body;

  if (!title) {
    res.status(400).json({ message: "El título es requerido." });
    return;
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        userId: Number(req.userId!),
      },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error al crear tarea", error });
  }
};

export const getTasks: RequestHandler = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const sort = (req.query.sort as string) || "dueDate";
    const sortDirection =
      (req.query.sortDirection as string) === "desc" ? "desc" : "asc";
    const userId = Number(req.userId);

    const now = new Date();
    const startOfToday = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0));
    const endOfToday = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999));

    const completedCount = await prisma.task.count({
      where: { userId, completed: true },
    });
    const highPriorityCount = await prisma.task.count({
      where: { userId, priority: "high" },
    });
    const dueTodayCount = await prisma.task.count({
      where: {
        userId,
        dueDate: { 
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    if (sort === "priority") {
      const tasks = await prisma.$queryRawUnsafe(`
        SELECT * FROM "Task"
        WHERE "userId" = $1
        ORDER BY 
          CASE "priority"
            WHEN 'high' THEN 1
            WHEN 'medium' THEN 2
            WHEN 'low' THEN 3
            ELSE 4
          END ${sortDirection}
        LIMIT $2 OFFSET $3
      `, userId, limit, skip);

      const total = await prisma.task.count({ where: { userId } });

      res.json({
        tasks,
        page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        completedCount,
        highPriorityCount,
        dueTodayCount,
      });
      return;
    }

    let orderBy: any;

    switch (sort) {
      case "alphabetical":
        orderBy = { title: sortDirection.toLowerCase() };
        break;
      case "dueDate":
      default:
        orderBy = { dueDate: sortDirection.toLowerCase() };
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where: { userId: Number(req.userId) },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.task.count({
        where: { userId: Number(req.userId) },
      }),
    ]);

    res.json({
      tasks,
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      completedCount,
      highPriorityCount,
      dueTodayCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tareas", error });
  }
};

export const updateTask: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { title, completed, priority, dueDate } = req.body;

  const data: any = {};
  if (title !== undefined) data.title = title;
  if (completed !== undefined) data.completed = completed;
  if (priority !== undefined) data.priority = priority;
  if (dueDate !== undefined) {
    if (typeof dueDate === "string") {
      data.dueDate = new Date(dueDate);
    }
  }

  console.log("Updating task with data:", data);

  try {
    const task = await prisma.task.updateMany({
      where: {
        id: Number(id),
        userId: Number(req.userId),
      },
      data,
    });

    if (task.count === 0) {
      res.status(404).json({ message: "Tarea no encontrada" });
      return;
    }

    res.json({ message: "Tarea actualizada" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar tarea", error });
  }
};

export const deleteTask: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.deleteMany({
      where: {
        id: Number(id),
        userId: Number(req.userId),
      },
    });

    if (task.count === 0) {
      res.status(404).json({ message: "Tarea no encontrada" });
      return;
    }

    res.json({ message: "Tarea eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar tarea", error });
  }
};
