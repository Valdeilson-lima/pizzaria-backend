import { Request, Response } from "express";
import { AuthUserService } from "../../services/user/authUserService";

class AuthUserController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    const authUserService = new AuthUserService();
    const result = await authUserService.execute({ email, password });
    res.status(200).json({ message: result.message, user: result.user });
  }
}

export { AuthUserController };
