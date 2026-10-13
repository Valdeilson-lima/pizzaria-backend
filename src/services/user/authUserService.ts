import { prisma } from "../../lib/prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthUserServiceResponse {
  email: string;
  password: string;
}

class AuthUserService {
  async execute({ email, password }: AuthUserServiceResponse) {
    const userExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!userExists) {
      throw new Error("Email ou senha inválidos");
    }

    const isPasswordValid = await compare(password, userExists.password);

    if (!isPasswordValid) {
      throw new Error("Email ou senha inválidos");
    }

    const token = sign(
      { user: userExists.id, email: userExists.email },
      process.env.JWT_SECRET as string,
      {
        subject: userExists.id,
        expiresIn: "1d",
      }
    );

    return {
      user: {
        id: userExists.id,
        name: userExists.name,
        email: userExists.email,
        role: userExists.role,
        createdAt: userExists.createdAt,
        token: token,
      },
      message: "Usuario autenticado com sucesso",
    };
  }
}

export { AuthUserService };
