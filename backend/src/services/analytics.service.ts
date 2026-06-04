import { prisma } from '../config/prisma';

export class AnalyticsService {
  public static async getSummary(userId: string) {
    const expenses = await prisma.expense.findMany({
      where: { userId, deletedAt: null },
      include: { category: true },
    });

    const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalTransactions = expenses.length;

    const categorySums: Record<string, number> = {};
    const categoryNames: Record<string, string> = {};

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

  public static async getCategories(userId: string) {
    const expenses = await prisma.expense.findMany({
      where: { userId, deletedAt: null },
      include: { category: true },
    });

    const categorySums: Record<string, number> = {};
    expenses.forEach((exp) => {
      const name = exp.category.name;
      categorySums[name] = (categorySums[name] || 0) + exp.amount;
    });

    return Object.entries(categorySums)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }

  public static async getMonthly(userId: string) {
    const expenses = await prisma.expense.findMany({
      where: { userId, deletedAt: null },
      orderBy: { transactionDate: 'asc' },
    });

    const dailySums: Record<string, number> = {};
    expenses.forEach((exp) => {
      const dateStr = exp.transactionDate.toISOString().split('T')[0];
      dailySums[dateStr] = (dailySums[dateStr] || 0) + exp.amount;
    });

    return Object.entries(dailySums)
      .map(([date, amount]) => ({ date, amount }));
  }
}
