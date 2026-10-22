import { Router } from 'express';
import { query } from '../db.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateBillSplit } from '../validators/billValidator.js';
import { calculateSplit } from '../money/splits.js';
import { NotFoundError } from '../errors.js';

const router = Router();

/**
 * POST /api/bills/split
 * Calculates and records a bill split for an active session.
 */
router.post(
  '/split',
  asyncHandler(async (req, res) => {
    // 1. Validate incoming request body
    const input = validateBillSplit(req.body);

    // 2. Fetch session and total order amount from database
    const sessionResult = await query(
      `SELECT s.id, COALESCE(SUM(o.total_amount_minor), 0) AS total_minor
       FROM sessions s
       LEFT JOIN orders o ON o.session_id = s.id
       WHERE s.id = $1
       GROUP BY s.id`,
      [input.sessionId]
    );

    if (sessionResult.rows.length === 0) {
      throw new NotFoundError(`Session with ID '${input.sessionId}' not found.`);
    }

    const totalMinor = Number(sessionResult.rows[0].total_minor);

    // 3. Compute shares using the bill-splitting engine
    const splitResult = calculateSplit(
      totalMinor,
      input.participants,
      input.splitType,
      input.customAmountsMinor
    );

    // 4. Return response payload
    res.status(200).json({
      message: 'Bill split calculated successfully',
      data: splitResult,
    });
  })
);

export default router;