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
            include: { category: true },
        });
        return expense;
    }
    static async getExpenses(userId) {
        return prisma_1.prisma.expense.findMany({
            where: { userId, deletedAt: null },
            include: { category: true },
            orderBy: { transactionDate: 'desc' },
        });
    }
    static async updateExpense(userId, expenseId, data) {
        const existing = await prisma_1.prisma.expense.findFirst({
            where: { id: expenseId, userId, deletedAt: null },
        });
        if (!existing) {
            throw { statusCode: 404, message: 'Expense not found' };
        }
        const updateData = { ...data };
        if (data.transactionDate) {
            updateData.transactionDate = new Date(data.transactionDate);
        }
        if (data.description && data.description !== existing.description) {
            const { categoryId, confidence, source } = await expense_classifier_service_1.ExpenseClassifierService.predictCategory(data.description);
            if (categoryId) {
                updateData.categoryId = categoryId;
                updateData.aiConfidence = confidence;
                updateData.predictionSource = source;
            }
        }
        return prisma_1.prisma.expense.update({
            where: { id: expenseId },
            data: updateData,
            include: { category: true },
        });
    }
    static async deleteExpense(userId, expenseId) {
        const existing = await prisma_1.prisma.expense.findFirst({
            where: { id: expenseId, userId, deletedAt: null },
        });
        if (!existing) {
            throw { statusCode: 404, message: 'Expense not found' };
        }
        return prisma_1.prisma.expense.update({
            where: { id: expenseId },
            data: { deletedAt: new Date() },
        });
    }
}
exports.ExpenseService = ExpenseService;
