/**
 * Currency configuration and formatting utilities
 * Multi-currency support for premium users
 */

export const CURRENCIES = {
    INR: {
        code: "INR",
        symbol: "₹",
        name: "Indian Rupee",
        locale: "en-IN",
    },
    USD: {
        code: "USD",
        symbol: "$",
        name: "US Dollar",
        locale: "en-US",
    },
    EUR: {
        code: "EUR",
        symbol: "€",
        name: "Euro",
        locale: "de-DE",
    },
    GBP: {
        code: "GBP",
        symbol: "£",
        name: "British Pound",
        locale: "en-GB",
    },
    JPY: {
        code: "JPY",
        symbol: "¥",
        name: "Japanese Yen",
        locale: "ja-JP",
        decimals: 0,
    },
    AUD: {
        code: "AUD",
        symbol: "A$",
        name: "Australian Dollar",
        locale: "en-AU",
    },
    CAD: {
        code: "CAD",
        symbol: "C$",
        name: "Canadian Dollar",
        locale: "en-CA",
    },
};

export const DEFAULT_CURRENCY = "INR";

/**
 * Get currency configuration by code
 * @param {string} currencyCode - Currency code (e.g., "USD", "INR")
 * @returns {object} Currency configuration
 */
export function getCurrency(currencyCode) {
    return CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY];
}

/**
 * Get currency symbol by code
 * @param {string} currencyCode - Currency code
 * @returns {string} Currency symbol
 */
export function getCurrencySymbol(currencyCode) {
    return getCurrency(currencyCode).symbol;
}

/**
 * Format amount with currency symbol and locale formatting
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code
 * @param {boolean} showSign - Whether to show +/- sign for positive/negative
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currencyCode = DEFAULT_CURRENCY, showSign = false) {
    const currency = getCurrency(currencyCode);
    const decimals = currency.decimals ?? 2;

    const absAmount = Math.abs(amount);
    const formatted = absAmount.toLocaleString(currency.locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });

    const sign = showSign ? (amount >= 0 ? "+" : "-") : (amount < 0 ? "-" : "");

    return `${sign}${currency.symbol}${formatted}`;
}

/**
 * Format amount for charts (shorter format)
 * @param {number} value - Amount to format
 * @param {string} currencyCode - Currency code
 * @returns {string} Short formatted currency string
 */
export function formatCurrencyShort(value, currencyCode = DEFAULT_CURRENCY) {
    const currency = getCurrency(currencyCode);
    return `${currency.symbol}${value.toLocaleString()}`;
}
