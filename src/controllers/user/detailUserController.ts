import { Request, Response } from "express";
import { DetailUserService } from "../../services/user/detailUserService";

class DetailUserController {
  async handle(req: Request, res: Response) {
    const user_id = req.user_id;

    const detailUserService = new DetailUserService();
    const user = await detailUserService.execute(user_id);

    if (user instanceof Error) {
      return res.status(400).json(user);
    }

    return res.json(user);
  }
}

export { DetailUserController };
