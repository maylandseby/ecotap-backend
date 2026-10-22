"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_js_1 = require("./config/config.js");
const billRoutes_js_1 = __importDefault(require("./routes/billRoutes.js"));
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health Check Route
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes
app.use('/api/bills', billRoutes_js_1.default);
// Global Error Handler Middleware (Must be registered last)
app.use(errorHandler_js_1.errorHandler);
// Start Server
app.listen(config_js_1.PORT, () => {
    console.log(`🚀 Eco Tap backend running on http://localhost:${config_js_1.PORT}`);
});
