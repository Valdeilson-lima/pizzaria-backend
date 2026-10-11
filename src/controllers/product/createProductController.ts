import { Request, Response } from "express";
import { CreateProductService } from "../../services/product/createProductService";

class CreateProductController {
  async handle(req: Request, res: Response) {
    const { name, price, description, categoryId } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Arquivo não fornecido" });
    }

    const createProductService = new CreateProductService();
    const product = await createProductService.execute({
      name,
      price,
      description,
      categoryId,
      imageBuffer: req.file.buffer,
      imageName: req.file.originalname,
    });
    return res.status(200).json(product);
  }
}

export { CreateProductController };
