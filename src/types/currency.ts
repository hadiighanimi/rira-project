export type CurrencyCode = "USD" | "ریال";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
}

export interface AmountValidation {
  value: number | null;
  error: string | null;
}
