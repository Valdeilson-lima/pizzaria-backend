import { prisma } from "../../lib/prisma";

interface ListByCategoryRequest {
  categoryId: string;
}

class ListByCategoryService {
  async execute({ categoryId }: ListByCategoryRequest) {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    const products = await prisma.product.findMany({
      where: {
        category_id: categoryId,
        disabled: false,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        banner: true,
        disabled: true,
        category_id: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return products;
  }
}

export { ListByCategoryService };
