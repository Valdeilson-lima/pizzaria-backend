import { prisma } from "../../lib/prisma";
import { hash } from "bcryptjs";

interface CreateUserServiceResponse {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ name, email, password }: CreateUserServiceResponse) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new Error("Usuario já existe");
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
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

    return {
      user,
      message: "Usuario criado com sucesso",
    };
  }
}

export { CreateUserService };
