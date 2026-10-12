import { prisma } from "../../lib/prisma";

interface FinishOrderRequest {
  order_id: string;
}

class FinishOrderService {
  async execute({ order_id }: FinishOrderRequest) {
    try {
      const order = await prisma.order.findUnique({
        where: {
          id: order_id,
        },
      });

      if (!order) {
        throw new Error("Pedido não encontrado");
      }

      if (order.status) {
        throw new Error("Este pedido já foi finalizado");
      }

      const orderUpdated = await prisma.order.update({
        where: {
          id: order_id,
        },
        data: {
          status: true,
        },
        select: {
          id: true,
          table: true,
          name: true,
          draft: true,
          status: true,
          createdAt: true,
        },
      });

      return orderUpdated;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Erro interno do servidor");
    }
  }
}

export { FinishOrderService };
