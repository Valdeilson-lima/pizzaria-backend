import { prisma } from "../../lib/prisma";

interface DeleteProductRequest {
  id: string;
}

class DeleteProductService {
  async execute({ id }: DeleteProductRequest) {
    const product = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    await prisma.product.update({
      where: {
        id,
      },
      data: {
        disabled: true,
      },
    });

    return { message: "Produto desabilitado com sucesso" };
  }
}

export { DeleteProductService };
