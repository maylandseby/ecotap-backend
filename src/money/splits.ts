import type { SplitType } from './money.js';
import { MoneyError } from './money.js';

export interface SplitResult {
  totalAmountMinor: number;
  participants: string[];
  splitType: SplitType;
  shares: { participant: string; amountMinor: number }[];
}

export function calculateSplit(
  totalMinor: number,
  participants: string[],
  splitType: SplitType,
  customAmountsMinor?: number[]
): SplitResult {
  if (participants.length === 0) {
    throw new MoneyError('At least one participant is required.', 'INVALID_PARTICIPANTS');
  }

  if (splitType === 'equal') {
    const baseShare = Math.floor(totalMinor / participants.length);
    let remainder = totalMinor % participants.length;

    const shares = participants.map((participant) => {
      const share = baseShare + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
      return { participant, amountMinor: share };
    });

    return { totalAmountMinor: totalMinor, participants, splitType, shares };
  }

  if (splitType === 'custom') {
    if (!customAmountsMinor || customAmountsMinor.length !== participants.length) {
      throw new MoneyError('Custom amounts must match participant count.', 'INVALID_CUSTOM_AMOUNTS');
    }

    const sumCustom = customAmountsMinor.reduce((acc, val) => acc + val, 0);
    if (sumCustom !== totalMinor) {
      throw new MoneyError(`Custom split sum (${sumCustom}) must equal total (${totalMinor}).`, 'SUM_MISMATCH');
    }

    const shares = participants.map((participant, index) => ({
      participant,
      amountMinor: customAmountsMinor[index],
    }));

    return { totalAmountMinor: totalMinor, participants, splitType, shares };
  }

  throw new MoneyError(`Unsupported split type: ${splitType}`, 'UNSUPPORTED_SPLIT');
}