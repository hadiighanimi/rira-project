import type { AmountValidation, CurrencyCode } from "../types/currency";

const AMOUNT_PATTERN = /^(?:\d+|\d*\.\d+)$/;

function validatePositiveNumber(
  input: string,
  fieldName: string,
): AmountValidation {
  const normalizedInput = input.trim();

  if (normalizedInput === "") {
    return { value: null, error: null };
  }

  const parsedNumber = Number(normalizedInput);

  if (Number.isFinite(parsedNumber) && parsedNumber < 0) {
    return { value: null, error: `${fieldName} cannot be negative.` };
  }

  if (!AMOUNT_PATTERN.test(normalizedInput) || !Number.isFinite(parsedNumber)) {
    return {
      value: null,
      error: `Please enter a valid ${fieldName.toLowerCase()}.`,
    };
  }

  if (parsedNumber === 0) {
    return { value: null, error: `${fieldName} must be greater than zero.` };
  }

  if (parsedNumber > Number.MAX_SAFE_INTEGER) {
    return {
      value: null,
      error: `That ${fieldName.toLowerCase()} is too large to convert safely.`,
    };
  }

  return { value: parsedNumber, error: null };
}

export function validateAmount(input: string): AmountValidation {
  return validatePositiveNumber(input, "Amount");
}

export function validateExchangeRate(input: string): AmountValidation {
  return validatePositiveNumber(input, "Dollar price");
}

export function convertAmount(
  amount: number,
  usdToIrrRate: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
): number | null {
  if (
    !Number.isFinite(amount) ||
    amount < 0 ||
    !Number.isFinite(usdToIrrRate) ||
    usdToIrrRate <= 0
  ) {
    return null;
  }

  if (fromCurrency === toCurrency) {
    return amount;
  }

  const convertedAmount =
    fromCurrency === "USD" ? amount * usdToIrrRate : amount / usdToIrrRate;

  return Number.isFinite(convertedAmount) ? convertedAmount : null;
}

export function formatAmount(amount: number, currency: CurrencyCode): string {
  const maximumFractionDigits = currency === "USD" ? 2 : 0;

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(amount);
}

export function formatExchangeRate(
  usdToIrrRate: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
): string {
  if (fromCurrency === toCurrency) {
    return `1 ${fromCurrency} = 1 ${toCurrency}`;
  }

  if (fromCurrency === "USD") {
    return `1 USD = ${formatAmount(usdToIrrRate, "ریال")} ریال`;
  }

  const inverseRate = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 8,
  }).format(1 / usdToIrrRate);

  return `1 IRR = ${inverseRate} USD`;
}
