import { ValidationError } from '../errors.js';
import type { SplitType } from '../money/money.js';

export interface CreateBillSplitInput {
  sessionId: string;
  splitType: SplitType;
  participants: string[];
  customAmountsMinor?: number[];
}

export function validateBillSplit(input: unknown): CreateBillSplitInput {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('Invalid request body: Expected an object.');
  }

  const { sessionId, splitType, participants, customAmountsMinor } = input as Record<string, unknown>;

  if (typeof sessionId !== 'string' || !sessionId.trim()) {
    throw new ValidationError('Validation failed', {
      sessionId: 'Session ID must be a non-empty string.',
    });
  }

  const validSplitTypes: SplitType[] = ['equal', 'itemized', 'custom'];
  if (typeof splitType !== 'string' || !validSplitTypes.includes(splitType as SplitType)) {
    throw new ValidationError('Validation failed', {
      splitType: `Split type must be one of: ${validSplitTypes.join(', ')}.`,
    });
  }

  if (!Array.isArray(participants) || participants.length === 0) {
    throw new ValidationError('Validation failed', {
      participants: 'Participants must be a non-empty array of strings.',
    });
  }

  const cleanedParticipants = participants.map((p, index) => {
    if (typeof p !== 'string' || !p.trim()) {
      throw new ValidationError('Validation failed', {
        participants: `Participant at index ${index} must be a valid non-empty string.`,
      });
    }
    return p.trim();
  });

  let cleanedCustomAmounts: number[] | undefined;
  if (customAmountsMinor !== undefined) {
    if (!Array.isArray(customAmountsMinor)) {
      throw new ValidationError('Validation failed', {
        customAmountsMinor: 'Custom amounts must be an array of numbers.',
      });
    }

    cleanedCustomAmounts = customAmountsMinor.map((amt, index) => {
      if (typeof amt !== 'number' || !Number.isInteger(amt) || amt < 0) {
        throw new ValidationError('Validation failed', {
          customAmountsMinor: `Custom amount at index ${index} must be a non-negative integer (ngwee).`,
        });
      }
      return amt;
    });
  }

  return {
    sessionId: sessionId.trim(),
    splitType: splitType as SplitType,
    participants: cleanedParticipants,
    ...(cleanedCustomAmounts ? { customAmountsMinor: cleanedCustomAmounts } : {}),
  };
}