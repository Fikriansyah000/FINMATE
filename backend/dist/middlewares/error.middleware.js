"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: err.errors,
        });
    }
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: statusCode === 500 ? 'Internal Server Error' : (err.message || 'Internal Server Error'),
    });
};
exports.errorHandler = errorHandler;
