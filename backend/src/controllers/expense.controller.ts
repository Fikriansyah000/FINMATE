import { Response, NextFunction } from 'express';
import { ExpenseService } from '../services/expense.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class ExpenseController {
  public static async createExpense(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await ExpenseService.createExpense(req.user!.id, req.body);
      res.status(201).json({
        ...result,
        transactionDate: result.transactionDate.toISOString().split('T')[0],
      });
    } catch (error) { next(error); }
  }

  public static async getExpenses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await ExpenseService.getExpenses(req.user!.id);
      res.status(200).json(result);
    } catch (error) { next(error); }
  }

  public static async updateExpense(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await ExpenseService.updateExpense(req.user!.id, req.params.id, req.body);
      res.status(200).json({
        ...result,
        transactionDate: result.transactionDate.toISOString().split('T')[0],
      });
    } catch (error) { next(error); }
  }

  public static async deleteExpense(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ExpenseService.deleteExpense(req.user!.id, req.params.id);
      res.status(204).send();
    } catch (error) { next(error); }
  }
}
