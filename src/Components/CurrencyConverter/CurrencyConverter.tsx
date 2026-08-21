import { useMemo, useState, type ChangeEvent } from "react";
import { CURRENCIES, CURRENCY_OPTIONS } from "../../constants/currency";
import type { CurrencyCode } from "../../types/currency";
import {
  convertAmount,
  formatAmount,
  formatExchangeRate,
  validateAmount,
  validateExchangeRate,
} from "../../utils/currency";
import "./CurrencyConverter.css";

export function CurrencyConverter() {
  const [amountInput, setAmountInput] = useState("");
  const [dollarPriceInput, setDollarPriceInput] = useState("");
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("USD");
  const [toCurrency, setToCurrency] = useState<CurrencyCode>("ریال");

  const validation = useMemo(() => validateAmount(amountInput), [amountInput]);
  const exchangeRateValidation = useMemo(
    () => validateExchangeRate(dollarPriceInput),
    [dollarPriceInput],
  );

  const convertedAmount = useMemo(() => {
    if (validation.value === null || exchangeRateValidation.value === null) {
      return null;
    }

    return convertAmount(
      validation.value,
      exchangeRateValidation.value,
      fromCurrency,
      toCurrency,
    );
  }, [
    exchangeRateValidation.value,
    fromCurrency,
    toCurrency,
    validation.value,
  ]);

  const resultIsVisible =
    validation.error === null &&
    exchangeRateValidation.error === null &&
    convertedAmount !== null;
  const rateLabel =
    exchangeRateValidation.value === null
      ? " "
      : formatExchangeRate(
          exchangeRateValidation.value,
          fromCurrency,
          toCurrency,
        );
  function handleCurrencyChange(
    event: ChangeEvent<HTMLSelectElement>,
    isFrom: boolean,
  ) {
    const selectedCurrency = event.target.value as CurrencyCode;

    if (isFrom) {
      setFromCurrency(selectedCurrency);
      if (selectedCurrency === toCurrency) {
        setToCurrency(selectedCurrency === "USD" ? "ریال" : "USD");
      }
      setAmountInput("");
    } else {
      setToCurrency(selectedCurrency);
      if (selectedCurrency === fromCurrency) {
        setFromCurrency(selectedCurrency === "USD" ? "ریال" : "USD");
      }
      setAmountInput("");
    }
  }

  function handleSwap() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmountInput("");
  }

  return (
    <main className="converter-page">
      <section className="converter-shell" aria-labelledby="converter-title">
        <div className="converter-header">
          <h1 id="converter-title">ماشین حساب صرافی</h1>
          <p>تبدیل دلار به ریال و بلعکس</p>
        </div>

        <form
          className="converter-form"
          onSubmit={(event) => event.preventDefault()}
          noValidate>
          <div className="field-group">
            <label htmlFor="dollar-price">نرخ دلار را به ریال وارد کنید</label>
            <div
              className={`amount-control${exchangeRateValidation.error ? " has-error" : ""}`}>
              <input
                maxLength={9}
                id="dollar-price"
                name="dollar-price"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="نرخ دلار را به ریال وارد نمایید "
                value={
                  dollarPriceInput
                    ? Number(
                        dollarPriceInput.replace(/\D/g, ""),
                      ).toLocaleString("en-US")
                    : ""
                }
                onChange={(event) =>
                  setDollarPriceInput(event.target.value.replace(/\D/g, ""))
                }
                aria-describedby={
                  exchangeRateValidation.error
                    ? "dollar-price-error"
                    : undefined
                }
                aria-invalid={exchangeRateValidation.error ? true : undefined}
              />
              <span aria-hidden="true">ریال</span>
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="amount">مبلغ</label>
            <div
              className={`amount-control${validation.error ? " has-error" : ""}`}>
              <input
                id="amount"
                name="amount"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="مبلغ را وارد نمایید..."
                value={
                  amountInput
                    ? Number(amountInput.replace(/\D/g, "")).toLocaleString(
                        "en-US",
                      )
                    : ""
                }
                onChange={(event) =>
                  setAmountInput(event.target.value.replace(/\D/g, ""))
                }
                aria-describedby={validation.error ? "amount-error" : undefined}
                aria-invalid={validation.error ? true : undefined}
                maxLength={toCurrency === "USD" ? 19 : 17}
              />
              <span aria-hidden="true">{CURRENCIES[fromCurrency].code}</span>
            </div>
          </div>
          <div className="currency-fields">
            <div className="field-group">
              <label htmlFor="from-currency">از</label>
              <div className="select-control">
                <span className="currency-symbol" aria-hidden="true">
                  {CURRENCIES[fromCurrency].symbol}
                </span>
                <select
                  className="bg-red"
                  id="from-currency"
                  name="from-currency"
                  value={fromCurrency}
                  onChange={(event) => handleCurrencyChange(event, true)}>
                  {CURRENCY_OPTIONS.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className="swap-button"
              type="button"
              onClick={handleSwap}
              aria-label="Swap from and to currencies"
              title="Swap currencies">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 7h11m0 0-3-3m3 3-3 3M17 17H6m0 0 3 3m-3-3 3-3" />
              </svg>
            </button>

            <div className="field-group">
              <label htmlFor="to-currency">به</label>
              <div className="select-control">
                <span className="currency-symbol" aria-hidden="true">
                  {CURRENCIES[toCurrency].symbol}
                </span>
                <select
                  id="to-currency"
                  name="to-currency"
                  value={toCurrency}
                  onChange={(event) => handleCurrencyChange(event, false)}>
                  {CURRENCY_OPTIONS.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </form>

        <section
          className={`result-card${resultIsVisible ? " is-ready" : ""}`}
          aria-live="polite">
          <div className="result-label-row">
            <span className="rate-title">مبلغ تبدیل شده</span>
            <span className="rate-pill">{rateLabel}</span>
          </div>
          {resultIsVisible ? (
            <output className="result-value">
              {formatAmount(convertedAmount, toCurrency)}{" "}
              <span>{toCurrency}</span>
            </output>
          ) : (
            <p className="result-placeholder">
              {!amountInput && !dollarPriceInput
                ? "لطفا مبلغ و نرخ دلار را وارد نمایید."
                : !dollarPriceInput
                  ? "لطفا نرخ دلار را وارد نمایید."
                  : !amountInput
                    ? "لطفا مبلغ را وارد نمایید."
                    : ""}
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
