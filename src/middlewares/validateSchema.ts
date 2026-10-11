import { ZodError, ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateSchema =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map((err) => ({
          message: err.message,
        }));
        return res.status(400).json({ errors: validationErrors });
      }
      next(error);
    }
  };
