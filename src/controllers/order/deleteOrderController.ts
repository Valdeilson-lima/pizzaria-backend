import { Request, Response } from "express";
import { DeleteOrderService } from "../../services/order/deleteOrderService";

class DeleteOrderController {
  async handle(req: Request, res: Response) {
    const { order_id } = req.query;
    const deleteOrderService = new DeleteOrderService();

    await deleteOrderService.execute({ order_id: order_id as string });

    return res.status(200).json({ message: "Pedido deletado com sucesso" });
  }
}

export { DeleteOrderController };
