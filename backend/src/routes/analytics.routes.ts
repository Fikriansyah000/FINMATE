import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/summary', AnalyticsController.getSummary);
router.get('/categories', AnalyticsController.getCategories);
router.get('/monthly', AnalyticsController.getMonthly);

export default router;
