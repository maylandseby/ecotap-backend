"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBillSplit = validateBillSplit;
const errors_js_1 = require("../errors.js");
function validateBillSplit(input) {
    if (!input || typeof input !== 'object') {
        throw new errors_js_1.ValidationError('Invalid request body: Expected an object.');
    }
    const { sessionId, splitType, participants, customAmountsMinor } = input;
    if (typeof sessionId !== 'string' || !sessionId.trim()) {
        throw new errors_js_1.ValidationError('Validation failed', {
            sessionId: 'Session ID must be a non-empty string.',
        });
    }
    const validSplitTypes = ['equal', 'itemized', 'custom'];
    if (typeof splitType !== 'string' || !validSplitTypes.includes(splitType)) {
        throw new errors_js_1.ValidationError('Validation failed', {
            splitType: `Split type must be one of: ${validSplitTypes.join(', ')}.`,
        });
    }
    if (!Array.isArray(participants) || participants.length === 0) {
        throw new errors_js_1.ValidationError('Validation failed', {
            participants: 'Participants must be a non-empty array of strings.',
        });
    }
    const cleanedParticipants = participants.map((p, index) => {
        if (typeof p !== 'string' || !p.trim()) {
            throw new errors_js_1.ValidationError('Validation failed', {
                participants: `Participant at index ${index} must be a valid non-empty string.`,
            });
        }
        return p.trim();
    });
    let cleanedCustomAmounts;
    if (customAmountsMinor !== undefined) {
        if (!Array.isArray(customAmountsMinor)) {
            throw new errors_js_1.ValidationError('Validation failed', {
                customAmountsMinor: 'Custom amounts must be an array of numbers.',
            });
        }
        cleanedCustomAmounts = customAmountsMinor.map((amt, index) => {
            if (typeof amt !== 'number' || !Number.isInteger(amt) || amt < 0) {
                throw new errors_js_1.ValidationError('Validation failed', {
                    customAmountsMinor: `Custom amount at index ${index} must be a non-negative integer (ngwee).`,
                });
            }
            return amt;
        });
    }
    return {
        sessionId: sessionId.trim(),
        splitType: splitType,
        participants: cleanedParticipants,
        ...(cleanedCustomAmounts ? { customAmountsMinor: cleanedCustomAmounts } : {}),
    };
}
