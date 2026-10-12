import { prisma } from "../../lib/prisma";

interface DetailOrderRequest {
  order_id: string;
}

class DetailOrderService {
  async execute({ order_id }: DetailOrderRequest) {
    try {
      const order = await prisma.order.findUnique({
        where: {
          id: order_id,
        },
        select: {
          id: true,
          table: true,
          name: true,
          draft: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          orderItems: {
            select: {
              id: true,
              amount: true,
              createdAt: true,
              updatedAt: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  description: true,
                  banner: true,
                },
              },
            },
          },
        },
      });

      if (!order) {
        throw new Error("Pedido não encontrado");
      }

      return order;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Internal server error");
    }
  }
}

export { DetailOrderService };
