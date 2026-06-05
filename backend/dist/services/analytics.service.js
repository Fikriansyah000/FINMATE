"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const prisma_1 = require("../config/prisma");
class AnalyticsService {
    static async getSummary(userId) {
        const expenses = await prisma_1.prisma.expense.findMany({
            where: { userId, deletedAt: null },
            include: { category: true },
        });
        const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const totalTransactions = expenses.length;
        const categorySums = {};
        const categoryNames = {};
        expenses.forEach((exp) => {
            categorySums[exp.categoryId] = (categorySums[exp.categoryId] || 0) + exp.amount;
            categoryNames[exp.categoryId] = exp.category.name;
        });
        let topCategory = null;
        let maxAmount = 0;
        for (const [id, amount] of Object.entries(categorySums)) {
            if (amount > maxAmount) {
                maxAmount = amount;
                topCategory = { name: categoryNames[id], amount };
            }
        }
        let averageDailySpending = 0;
        if (expenses.length > 0) {
            const dates = expenses.map(e => e.transactionDate.getTime());
            const minDate = Math.min(...dates);
            const maxDate = Math.max(...dates);
            const days = Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1);
            averageDailySpending = Math.round(totalSpending / days);
        }
        return {
            totalSpending,
            totalTransactions,
            topCategory,
            averageDailySpending,
        };
    }
    static async getCategories(userId) {
        const expenses = await prisma_1.prisma.expense.findMany({
            where: { userId, deletedAt: null },
            include: { category: true },
        });
        const categorySums = {};
        expenses.forEach((exp) => {
            const name = exp.category.name;
            categorySums[name] = (categorySums[name] || 0) + exp.amount;
        });
        return Object.entries(categorySums)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount);
    }
    static async getMonthly(userId) {
        const expenses = await prisma_1.prisma.expense.findMany({
            where: { userId, deletedAt: null },
            orderBy: { transactionDate: 'asc' },
        });
        const dailySums = {};
        expenses.forEach((exp) => {
            const dateStr = exp.transactionDate.toISOString().split('T')[0];
            dailySums[dateStr] = (dailySums[dateStr] || 0) + exp.amount;
        });
        return Object.entries(dailySums)
            .map(([date, amount]) => ({ date, amount }));
    }
}
exports.AnalyticsService = AnalyticsService;
