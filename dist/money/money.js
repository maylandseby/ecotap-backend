"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneyError = exports.MAX_PARTIES = exports.MAX_MINOR = exports.CURRENCY = void 0;
exports.allocateEqual = allocateEqual;
exports.CURRENCY = 'ZMW';
exports.MAX_MINOR = 100000000000; // 100 billion in minor units (ngwee)
exports.MAX_PARTIES = 100;
class MoneyError extends Error {
    code;
    details;
    constructor(code, message, details) {
        super(message || code);
        this.code = code;
        this.details = details;
        this.name = 'MoneyError';
    }
}
exports.MoneyError = MoneyError;
/**
 * Splits an amount equally among a given number of parties,
 * distributing any remainder ngwee one by one to ensure exact totals.
 */
function allocateEqual(amountMinor, parties) {
    if (amountMinor < 0 || parties <= 0 || parties > exports.MAX_PARTIES) {
        throw new MoneyError('INVALID_PARTIES', 'Invalid amount or parties count for equal split.');
    }
    const base = Math.floor(amountMinor / parties);
    const remainder = amountMinor % parties;
    const result = new Array(parties);
    for (let i = 0; i < parties; i++) {
        result[i] = base + (i < remainder ? 1 : 0);
    }
    return result;
}
