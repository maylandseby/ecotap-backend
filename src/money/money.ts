export const CURRENCY = 'ZMW';
export const MAX_MINOR = 100000000000; // 100 billion in minor units (ngwee)
export const MAX_PARTIES = 100;

export type SplitType = 'equal' | 'itemized' | 'custom';

export interface Share {
  participant: string;
  amountMinor: number;
  itemizedOnly?: {
    breakdownOfAmountMinor?: number;
  };
  taxMinor?: number;
  serviceChargeMinor?: number;
}

export interface SplitResult {
  type: SplitType;
  totalMinor: number;
  shares: Share[];
}

export type MoneyErrorCode = 
  | 'INVALID_AMOUNT'
  | 'INVALID_PARTIES'
  | 'INVALID_RATE'
  | 'INVALID_WEIGHTS'
  | 'INVALID_PARTICIPANT'
  | 'INVALID_ASSIGNMENT'
  | 'SPLIT_MISMATCH';

export class MoneyError extends Error {
  constructor(
    public code: MoneyErrorCode, 
    message?: string, 
    public details?: unknown
  ) {
    super(message || code);
    this.name = 'MoneyError';
  }
}

/**
 * Splits an amount equally among a given number of parties, 
 * distributing any remainder ngwee one by one to ensure exact totals.
 */
export function allocateEqual(amountMinor: number, parties: number): number[] {
  if (amountMinor < 0 || parties <= 0 || parties > MAX_PARTIES) {
    throw new MoneyError('INVALID_PARTIES', 'Invalid amount or parties count for equal split.');
  }

  const base = Math.floor(amountMinor / parties);
  const remainder = amountMinor % parties;
  const result: number[] = new Array(parties);

  for (let i = 0; i < parties; i++) {
    result[i] = base + (i < remainder ? 1 : 0);
  }

  return result;
}