import { Request, Response } from "express";
import { ListOrderServices } from "../../services/order/listOrderServices";

class ListOrdersController {
  async handle(req: Request, res: Response) {
    const { draft } = req.query;

    const listOrderService = new ListOrderServices();
    const orders = await listOrderService.execute({
      draft: draft === "true" ? true : false,
    });

    return res.status(200).json(orders);
  }
}

export { ListOrdersController };
