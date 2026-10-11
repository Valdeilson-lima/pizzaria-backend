import { z } from "zod";

const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Nome do produto é obrigatório" })
      .min(1, "Nome do produto é obrigatório"),
    price: z
      .string()
      .min(1, "Preço é obrigatório")
      .regex(/^[0-9]+$/, "Preço deve ser numérico"),
    description: z
      .string({ message: "Descrição é obrigatória" })
      .min(1, "Descrição é obrigatória"),
    categoryId: z
      .string({ message: "Categoria é obrigatória" })
      .min(1, "Categoria é obrigatória"),
  }),
});

const listProductsSchema = z.object({
  query: z
    .object({
      disabled: z
        .enum(["true", "false"], {
          message: "O parâmetro disabled deve ser 'true' ou 'false'",
        })
        .optional(),
    })
    .optional(),
});

export { createProductSchema, listProductsSchema };
