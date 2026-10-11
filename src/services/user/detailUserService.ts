import { prisma } from "../../lib/prisma";

class DetailUserService {
  async execute(user_id: string) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: user_id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new Error("404 - Usuário não encontrado");
      }

      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("500 - Erro interno do servidor");
    }
  }
}

export { DetailUserService };
