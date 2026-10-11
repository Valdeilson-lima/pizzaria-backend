import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface Payload {
  sub: string;
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const [bearer, token] = authToken.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ error: "Token inválido" });
  }

  try {
    const { sub } = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as Payload;
    req.user_id = sub;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
