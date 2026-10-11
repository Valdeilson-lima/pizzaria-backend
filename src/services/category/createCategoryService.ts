import { prisma } from "../../lib/prisma";

interface CategoryRequest {
  name: string;
}

class CreateCategoryService {
  async execute({ name }: CategoryRequest) {
    if (!name) {
      throw new Error("Nome da categoria inválido");
    }

    const categoryAlreadyExists = await prisma.category.findFirst({
      where: {
        name: name,
      },
    });

    if (categoryAlreadyExists) {
      throw new Error("Categoria já existe");
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    return category;
  }
}

export { CreateCategoryService };
