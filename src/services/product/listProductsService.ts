import { prisma } from "../../lib/prisma";

interface ListProductsRequest {
  disabled?: boolean;
}

class ListProductsService {
  async execute({ disabled = false }: ListProductsRequest) {
    const products = await prisma.product.findMany({
      where: {
        disabled,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        banner: true,
        disabled: true,
        category_id: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  }
}

export { ListProductsService };
