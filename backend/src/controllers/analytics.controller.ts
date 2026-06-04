import { Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AnalyticsController {
  public static async getSummary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await AnalyticsService.getSummary(req.user!.id);
      res.status(200).json(result);
    } catch (error) { next(error); }
  }

  public static async getCategories(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await AnalyticsService.getCategories(req.user!.id);
      res.status(200).json(result);
    } catch (error) { next(error); }
  }

  public static async getMonthly(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await AnalyticsService.getMonthly(req.user!.id);
      res.status(200).json(result);
    } catch (error) { next(error); }
  }
}
