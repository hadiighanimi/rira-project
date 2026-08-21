import type { CurrencyCode, CurrencyConfig } from "../types/currency";

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: "USD",
    symbol: "$",
  },
  ریال: {
    code: "ریال",
    symbol: "﷼",
  },
};

export const CURRENCY_OPTIONS = Object.values(CURRENCIES);
