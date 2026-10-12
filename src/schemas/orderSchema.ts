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

export const addItemOrderSchema = z.object({
  body: z.object({
    order_id: z
      .string({ message: "O ID do pedido é obrigatório" })
      .min(1, { message: "O ID do pedido é obrigatório" }),
    product_id: z
      .string({ message: "O ID do produto é obrigatório" })
      .min(1, { message: "O ID do produto é obrigatório" }),
    amount: z
      .number({ message: "A quantidade é obrigatória e deve ser um número" })
      .int({ message: "A quantidade deve ser um número inteiro" })
      .positive({ message: "A quantidade deve ser maior que zero" }),
  }),
});
