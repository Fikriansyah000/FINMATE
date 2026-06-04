import { prisma } from '../config/prisma';
import { ExpenseClassifierService } from './expense-classifier.service';

export class ExpenseService {
  public static async createExpense(userId: string, data: any) {
    const { categoryId, confidence, source } = await ExpenseClassifierService.predictCategory(data.description);

    if (!categoryId) {
      throw new Error('Failed to classify expense and fallback category not found.');
    }

    const expense = await prisma.expense.create({
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

  public static async getExpenses(userId: string) {
    return prisma.expense.findMany({
      where: { userId, deletedAt: null },
      include: { category: true },
      orderBy: { transactionDate: 'desc' },
    });
  }

  public static async updateExpense(userId: string, expenseId: string, data: any) {
    const existing = await prisma.expense.findFirst({
      where: { id: expenseId, userId, deletedAt: null },
    });

    if (!existing) {
      throw { statusCode: 404, message: 'Expense not found' };
    }

    const updateData: any = { ...data };
    if (data.transactionDate) {
      updateData.transactionDate = new Date(data.transactionDate);
    }

    if (data.description && data.description !== existing.description) {
      const { categoryId, confidence, source } = await ExpenseClassifierService.predictCategory(data.description);
      if (categoryId) {
        updateData.categoryId = categoryId;
        updateData.aiConfidence = confidence;
        updateData.predictionSource = source;
      }
    }

    return prisma.expense.update({
      where: { id: expenseId },
      data: updateData,
      include: { category: true },
    });
  }

  public static async deleteExpense(userId: string, expenseId: string) {
    const existing = await prisma.expense.findFirst({
      where: { id: expenseId, userId, deletedAt: null },
    });

    if (!existing) {
      throw { statusCode: 404, message: 'Expense not found' };
    }

    return prisma.expense.update({
      where: { id: expenseId },
      data: { deletedAt: new Date() },
    });
  }
}
