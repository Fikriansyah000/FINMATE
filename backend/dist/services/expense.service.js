"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const prisma_1 = require("../config/prisma");
const expense_classifier_service_1 = require("./expense-classifier.service");
class ExpenseService {
    static async createExpense(userId, data) {
        const { categoryId, confidence, source } = await expense_classifier_service_1.ExpenseClassifierService.predictCategory(data.description);
        if (!categoryId) {
            throw new Error('Failed to classify expense and fallback category not found.');
        }
        const expense = await prisma_1.prisma.expense.create({
            data: {
                userId,
                categoryId,
                description: data.description,
                amount: data.amount,
                transactionDate: new Date(data.transactionDate),
                aiConfidence: confidence,
                predictionSource: source,
            },
            include: {
                category: true,
            },
        });
        return expense;
    }
    static async getExpenses(userId) {
        // Basic get without complex filters for skeleton
        const expenses = await prisma_1.prisma.expense.findMany({
            where: { userId },
            include: {
                category: true,
            },
            orderBy: {
                transactionDate: 'desc',
            },
        });
        return expenses;
    }
}
exports.ExpenseService = ExpenseService;
