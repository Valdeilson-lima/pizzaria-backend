import { prisma } from "../../lib/prisma";

interface CreateOrderRequest {
  table: number;
  name?: string;
}

class CreateOrderService {
  async execute({ table, name }: CreateOrderRequest) {
    if (!table || table <= 0) {
      throw new Error("Número da mesa inválido");
    }

    const orderExists = await prisma.order.findFirst({
      where: {
        table,
        status: false,
      },
    });

    if (orderExists) {
      throw new Error("Mesa já está ocupada");
    }

    const order = await prisma.order.create({
      data: {
        table,
        name,
      },
      select: {
        id: true,
        table: true,
        name: true,
        status: true,
        draft: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return order;
  }
}

export { CreateOrderService };
