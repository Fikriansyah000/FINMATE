"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseController = void 0;
const expense_service_1 = require("../services/expense.service");
class ExpenseController {
    static async createExpense(req, res, next) {
        try {
            const result = await expense_service_1.ExpenseService.createExpense(req.user.id, req.body);
            res.status(201).json({
                ...result,
                transactionDate: result.transactionDate.toISOString().split('T')[0],
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getExpenses(req, res, next) {
        try {
            const result = await expense_service_1.ExpenseService.getExpenses(req.user.id);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateExpense(req, res, next) {
        try {
            const result = await expense_service_1.ExpenseService.updateExpense(req.user.id, req.params.id, req.body);
            res.status(200).json({
                ...result,
                transactionDate: result.transactionDate.toISOString().split('T')[0],
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteExpense(req, res, next) {
        try {
            await expense_service_1.ExpenseService.deleteExpense(req.user.id, req.params.id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ExpenseController = ExpenseController;
