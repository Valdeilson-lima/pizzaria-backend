import { prisma } from "../../lib/prisma";

interface ItemProps {
  order_id: string;
  product_id: string;
  amount: number;
}

class AddItemOrderService {
  async execute({ order_id, product_id, amount }: ItemProps) {
    try {
      const orderExists = await prisma.order.findFirst({
        where: { id: order_id },
      });
      if (!orderExists) throw new Error("Pedido não encontrado");

      const productExists = await prisma.product.findFirst({
        where: { id: product_id, disabled: false },
      });
      if (!productExists) throw new Error("Produto não encontrado");

      const orderItem = await prisma.orderItem.create({
        data: {
          order_id,
          product_id,
          amount,
        },
        select: {
          id: true,
          order_id: true,
          product_id: true,
          amount: true,
          createdAt: true,
          product: {
            select: {
              name: true,
              price: true,
            },
          },
        },
      });

      return orderItem;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Erro ao adicionar item ao pedido");
    }
  }
}

export { AddItemOrderService };
