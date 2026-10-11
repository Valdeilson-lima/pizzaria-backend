import { Request, Response } from "express";
import { DeleteProductService } from "../../services/product/deleteProductService";

class DeleteProductController {
  async handle(req: Request, res: Response) {
    const productId = req.query.productId as string;

    if (!productId) {
      return res.status(400).json({ message: "Produto nao informado" });
    }

    const deleteProductService = new DeleteProductService();
    const result = await deleteProductService.execute({ id: productId });

    return res.json(result);
  }
}

export { DeleteProductController };
