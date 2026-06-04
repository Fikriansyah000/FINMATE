"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const prisma_1 = require("../config/prisma");
class CategoryController {
    static async getCategories(req, res, next) {
        try {
            const categories = await prisma_1.prisma.category.findMany({
                orderBy: { name: 'asc' }
            });
            res.status(200).json(categories);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CategoryController = CategoryController;
