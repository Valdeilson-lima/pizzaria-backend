import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string("O nome da categoria é obrigatório")
      .min(3, "O nome da categoria precisa ter pelo menos 3 caracteres"),
  }),
});
