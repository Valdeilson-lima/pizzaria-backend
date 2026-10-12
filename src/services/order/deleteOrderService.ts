import { prisma } from "../../lib/prisma";

interface DeleteOrderRequest {
  order_id: string;
}

class DeleteOrderService {
  async execute({ order_id }: DeleteOrderRequest) {
    try {
      const order = await prisma.order.findUnique({
        where: {
          id: order_id,
        },
      });

      if (!order) {
        throw new Error("Pedido não encontrado");
      }

      await prisma.order.delete({
        where: {
          id: order_id,
        },
      });

      return { message: "Pedido deletado com sucesso" };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Falha ao deletar pedido");
    }
  }
}

export { DeleteOrderService };
