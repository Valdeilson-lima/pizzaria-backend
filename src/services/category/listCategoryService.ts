import { prisma } from "../../lib/prisma";

class ListCategoryService {
  async execute() {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  }
}

export { ListCategoryService };
