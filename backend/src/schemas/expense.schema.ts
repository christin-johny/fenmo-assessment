import { z } from 'zod';

export const createExpenseSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be a positive number"),
    category: z.string().min(1, "Category is required"),
    description: z.string().optional().default(""),
    date: z.string().datetime({ message: "Invalid ISO date string" }).refine(
      (val) => new Date(val) <= new Date(),
      { message: "Expense date cannot be in the future" }
    ),
    idempotencyKey: z.string().min(1, "Idempotency key is required"),
  })
});
