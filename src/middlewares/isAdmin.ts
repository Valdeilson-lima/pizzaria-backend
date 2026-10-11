import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user_id = req.user_id;

  if (!user_id) {
    res.status(401).json({ error: "Usuário não autenticado" });
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      id: user_id,
    },
    select: {
      role: true,
    },
  });

  if (!user) {
    res.status(401).json({ error: "Usuário não autenticado" });
    return;
  }

  if (user.role !== "ADMIN") {
    res.status(403).json({ error: "Acesso negado" });
    return;
  }

  return next();
};
