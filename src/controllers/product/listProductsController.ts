import { Request, Response } from "express";
import { ListProductsService } from "../../services/product/listProductsService";

class ListProductsController {
  async handle(req: Request, res: Response) {
    const { disabled } = req.query;

    const listProductsService = new ListProductsService();
    const products = await listProductsService.execute({
      disabled: disabled === "true",
    });

    return res.status(200).json(products);
  }
}

export { ListProductsController };
