"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = require("../services/analytics.service");
class AnalyticsController {
    static async getSummary(req, res, next) {
        try {
            const result = await analytics_service_1.AnalyticsService.getSummary(req.user.id);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async getCategories(req, res, next) {
        try {
            const result = await analytics_service_1.AnalyticsService.getCategories(req.user.id);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async getMonthly(req, res, next) {
        try {
            const result = await analytics_service_1.AnalyticsService.getMonthly(req.user.id);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AnalyticsController = AnalyticsController;
