"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const expense_routes_1 = __importDefault(require("./expense.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const router = (0, express_1.Router)();
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'finmate-backend'
    });
});
router.use('/auth', auth_routes_1.default);
router.use('/expenses', expense_routes_1.default);
router.use('/categories', category_routes_1.default);
exports.default = router;
