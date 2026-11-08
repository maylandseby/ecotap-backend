"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errors_js_1 = require("../errors.js");
const money_js_1 = require("../money/money.js");
function errorHandler(err, _req, res, _next) {
    // Handle explicit custom application errors
    if (err instanceof errors_js_1.AppError) {
        res.status(err.statusCode).json({
            error: err.name,
            message: err.message,
            ...(err.details ? { details: err.details } : {}),
        });
        return;
    }
    // Handle core Money module errors cleanly
    if (err instanceof money_js_1.MoneyError) {
        res.status(400).json({
            error: 'MoneyError',
            code: err.code,
            message: err.message,
            ...(err.details ? { details: err.details } : {}),
        });
        return;
    }
    // Fallback for unhandled internal server errors
    console.error('Unhandled Error:', err);
    res.status(500).json({
        error: 'InternalServerError',
        message: 'An unexpected error occurred on the server.',
    });
}
