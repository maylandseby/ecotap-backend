"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_js_1 = require("../db.js");
const asyncHandler_js_1 = require("../middleware/asyncHandler.js");
const billValidator_js_1 = require("../validators/billValidator.js");
const splits_js_1 = require("../money/splits.js");
const errors_js_1 = require("../errors.js");
const router = (0, express_1.Router)();
/**
 * POST /api/bills/split
 * Calculates and records a bill split for an active session.
 */
router.post('/split', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    // 1. Validate incoming request body
    const input = (0, billValidator_js_1.validateBillSplit)(req.body);
    // 2. Fetch session and total order amount from database
    const sessionResult = await (0, db_js_1.query)(`SELECT s.id, COALESCE(SUM(o.total_amount_minor), 0) AS total_minor
       FROM sessions s
       LEFT JOIN orders o ON o.session_id = s.id
       WHERE s.id = $1
       GROUP BY s.id`, [input.sessionId]);
    if (sessionResult.rows.length === 0) {
        throw new errors_js_1.NotFoundError(`Session with ID '${input.sessionId}' not found.`);
    }
    const totalMinor = Number(sessionResult.rows[0].total_minor);
    // 3. Compute shares using the bill-splitting engine
    const splitResult = (0, splits_js_1.calculateSplit)(totalMinor, input.participants, input.splitType, input.customAmountsMinor);
    // 4. Return response payload
    res.status(200).json({
        message: 'Bill split calculated successfully',
        data: splitResult,
    });
}));
exports.default = router;
