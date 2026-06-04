import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createExpenseSchema, updateExpenseSchema, deleteExpenseSchema, getExpensesSchema } from '../validations/expense.validation';

const router = Router();
router.use(authenticate);

router.post('/', validate(createExpenseSchema), ExpenseController.createExpense);
router.get('/', validate(getExpensesSchema), ExpenseController.getExpenses);
router.patch('/:id', validate(updateExpenseSchema), ExpenseController.updateExpense);
router.delete('/:id', validate(deleteExpenseSchema), ExpenseController.deleteExpense);

export default router;
