import { Request, Response } from "express";
import { AddItemOrderService } from "../../services/order/addItemOrderService";

class AddItemOrderController {
  async handle(req: Request, res: Response) {
    const { order_id, product_id, amount } = req.body;

    const addItemOrderService = new AddItemOrderService();
    const addItemOrder = await addItemOrderService.execute({
      order_id,
      product_id,
      amount,
    });

    return res.json(addItemOrder);
  }
}

export { AddItemOrderController };
