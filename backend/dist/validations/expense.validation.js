"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpensesSchema = exports.deleteExpenseSchema = exports.updateExpenseSchema = exports.createExpenseSchema = void 0;
const zod_1 = require("zod");
exports.createExpenseSchema = zod_1.z.object({
    body: zod_1.z.object({
        description: zod_1.z.string().min(1, 'Description is required'),
        amount: zod_1.z.number().int().positive('Amount must be a positive integer'),
        transactionDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: 'Invalid date format',
        }),
    }),
});
exports.updateExpenseSchema = zod_1.z.object({
    body: zod_1.z.object({
        description: zod_1.z.string().min(1).optional(),
        amount: zod_1.z.number().int().positive().optional(),
        transactionDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val))).optional(),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid expense ID'),
    }),
});
exports.deleteExpenseSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid expense ID'),
    }),
});
exports.getExpensesSchema = zod_1.z.object({
    query: zod_1.z.object({
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
    }),
});
