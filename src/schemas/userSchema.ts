import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string("O nome é obrigatório")
      .min(3, { message: "O nome precisa ter pelo menos 3 caracteres" }),
    email: z.email({ message: "O email é inválido" }),
    password: z
      .string("A senha é obrigatória")
      .min(6, { message: "A senha precisa ter pelo menos 6 caracteres" }),
  }),
});

export const authUserSchema = z.object({
  body: z.object({
    email: z.email({ message: "O email é inválido" }),
    password: z
      .string("A senha é obrigatória")
      .min(6, { message: "A senha precisa ter pelo menos 6 caracteres" }),
  }),
});
