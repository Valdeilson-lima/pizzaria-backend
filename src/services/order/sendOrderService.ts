import { prisma } from "../../lib/prisma";

interface SendOrderRequest {
  order_id: string;
  name?: string;
}

class SendOrderService {
  async execute({ order_id, name }: SendOrderRequest) {
    try {
      const order = await prisma.order.findUnique({
        where: {
          id: order_id,
        },
      });

      if (!order) {
        throw new Error("Pedido não encontrado");
      }

      const orderUpdated = await prisma.order.update({
        where: {
          id: order_id,
        },
        data: {
          draft: false,
          ...(name && name.trim() !== "" ? { name: name.trim() } : {}),
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

export { SendOrderService };
