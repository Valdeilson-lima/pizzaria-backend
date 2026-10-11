import { Request, Response } from "express";
import { CreateCategoryService } from "../../services/category/createCategoryService";

class CreateCategoryController {
  async handle(req: Request, res: Response) {
    const { name } = req.body;

    const createCategoryService = new CreateCategoryService();
    const category = await createCategoryService.execute({ name });

    if (category instanceof Error) {
      return res.status(400).json({ error: category.message });
    }

    return res
      .status(201)
      .json({ message: "Categoria criada com sucesso", category });
  }
}

export { CreateCategoryController };
