import { z } from 'zod';

export const createExpenseSchema = z.object({
  body: z.object({
    description: z.string().min(1, 'Description is required'),
    amount: z.number().int().positive('Amount must be a positive integer'),
    transactionDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
  }),
});

export const updateExpenseSchema = z.object({
  body: z.object({
    description: z.string().min(1).optional(),
    amount: z.number().int().positive().optional(),
    transactionDate: z.string().refine((val) => !isNaN(Date.parse(val))).optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid expense ID'),
  }),
});

export const deleteExpenseSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid expense ID'),
  }),
});

export const getExpensesSchema = z.object({
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});
