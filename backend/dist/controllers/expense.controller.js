"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseController = void 0;
const expense_service_1 = require("../services/expense.service");
class ExpenseController {
    static async createExpense(req, res, next) {
        try {
            const userId = req.user.id;
            const result = await expense_service_1.ExpenseService.createExpense(userId, req.body);
            res.status(201).json({
                id: result.id,
                description: result.description,
                amount: result.amount,
                category: {
                    id: result.category.id,
                    name: result.category.name,
                },
                aiConfidence: result.aiConfidence,
                predictionSource: result.predictionSource,
                transactionDate: result.transactionDate.toISOString().split('T')[0], // format match
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getExpenses(req, res, next) {
        try {
            const userId = req.user.id;
            const result = await expense_service_1.ExpenseService.getExpenses(userId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ExpenseController = ExpenseController;
