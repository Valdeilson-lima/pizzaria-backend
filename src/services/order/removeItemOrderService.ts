import { prisma } from "../../lib/prisma";

interface RemoveItemRequest {
  item_id: string;
}

class RemoveItemOrderService {
  async execute({ item_id }: RemoveItemRequest) {
    const itemExists = await prisma.orderItem.findFirst({
      where: {
        id: item_id,
      },
    });

    if (!itemExists) {
      throw new Error("Item não encontrado");
    }

    const orderItem = await prisma.orderItem.delete({
      where: {
        id: item_id,
      },
    });

    return orderItem;
  }
}

export { RemoveItemOrderService };
