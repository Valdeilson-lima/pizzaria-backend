import { prisma } from "../../lib/prisma";

interface ListOrderRequest {
  draft?: boolean;
}

class ListOrderServices {
  async execute({ draft = false }: ListOrderRequest) {
    const orders = await prisma.order.findMany({
      where: {
        draft,
      },
      select: {
        id: true,
        table: true,
        name: true,
        status: true,
        draft: true,
        createdAt: true,
        orderItems: {
          select: {
            id: true,
            amount: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                description: true,
                banner: true,
                disabled: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return orders;
  }
}

export { ListOrderServices };
