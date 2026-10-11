import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const isAdmin = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const user_id = req.user_id;

  if (!user_id) {
    return _res.status(401).json({ error: "Usuário não autenticado" });
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
    return _res.status(401).json({ error: "Usuário não autenticado" });
  }

  if (user.role !== "ADMIN") {
    return _res.status(403).json({ error: "Acesso negado" });
  }

  return next();
};
