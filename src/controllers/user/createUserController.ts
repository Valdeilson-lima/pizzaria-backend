import { Request, Response } from "express";
import { CreateUserService } from "../../services/user/createUserService";

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const createUserService = new CreateUserService();
    const result = await createUserService.execute({ name, email, password });

    res.status(201).json({ message: result });
  }
}

export { CreateUserController };
