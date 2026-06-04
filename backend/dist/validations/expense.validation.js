"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpensesSchema = exports.createExpenseSchema = void 0;
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
exports.getExpensesSchema = zod_1.z.object({
    query: zod_1.z.object({
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
    }),
});
