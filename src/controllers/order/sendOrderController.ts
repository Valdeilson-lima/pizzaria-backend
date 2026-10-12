import { Request, Response } from "express";
import { SendOrderService } from "../../services/order/sendOrderService";

class SendOrderController {
  async handle(req: Request, res: Response) {
    const { order_id, name } = req.body;

    const sendOrderService = new SendOrderService();
    const order = await sendOrderService.execute({ order_id, name });

    return res.json(order);
  }
}

export { SendOrderController };
