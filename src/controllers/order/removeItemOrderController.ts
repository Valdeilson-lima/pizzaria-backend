import { Request, Response } from "express";
import { RemoveItemOrderService } from "../../services/order/removeItemOrderService";

class RemoveItemOrderController {
  async handle(req: Request, res: Response) {
    const item_id = req.query.item_id as string;

    const removeItemOrderService = new RemoveItemOrderService();
    const orderItem = await removeItemOrderService.execute({ item_id });

    return res.json(orderItem);
  }
}

export { RemoveItemOrderController };
