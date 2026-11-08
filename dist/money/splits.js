"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSplit = calculateSplit;
const money_js_1 = require("./money.js");
function calculateSplit(totalMinor, participants, splitType, customAmountsMinor) {
    if (participants.length === 0) {
        throw new money_js_1.MoneyError('At least one participant is required.', 'INVALID_PARTICIPANTS');
    }
    if (splitType === 'equal') {
        const baseShare = Math.floor(totalMinor / participants.length);
        let remainder = totalMinor % participants.length;
        const shares = participants.map((participant) => {
            const share = baseShare + (remainder > 0 ? 1 : 0);
            if (remainder > 0)
                remainder--;
            return { participant, amountMinor: share };
        });
        return { totalAmountMinor: totalMinor, participants, splitType, shares };
    }
    if (splitType === 'custom') {
        if (!customAmountsMinor || customAmountsMinor.length !== participants.length) {
            throw new money_js_1.MoneyError('Custom amounts must match participant count.', 'INVALID_CUSTOM_AMOUNTS');
        }
        const sumCustom = customAmountsMinor.reduce((acc, val) => acc + val, 0);
        if (sumCustom !== totalMinor) {
            throw new money_js_1.MoneyError(`Custom split sum (${sumCustom}) must equal total (${totalMinor}).`, 'SUM_MISMATCH');
        }
        const shares = participants.map((participant, index) => ({
            participant,
            amountMinor: customAmountsMinor[index],
        }));
        return { totalAmountMinor: totalMinor, participants, splitType, shares };
    }
    throw new money_js_1.MoneyError(`Unsupported split type: ${splitType}`, 'UNSUPPORTED_SPLIT');
}
