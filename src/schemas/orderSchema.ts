import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    table: z
      .number({
        message: "O número da mesa é obrigatório e deve ser um número",
      })
      .int({ message: "O número da mesa deve ser um número inteiro" })
      .positive({ message: "O número da mesa deve ser maior que zero" }),
    name: z.string().optional(),
  }),
});

export const listOrdersSchema = z.object({
  query: z
    .object({
      draft: z
        .enum(["true", "false"], {
          message: "O parâmetro draft deve ser 'true' ou 'false'",
        })
        .optional(),
    })
    .optional(),
});
