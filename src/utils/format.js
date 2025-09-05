import { OUTCOMES } from './constants.js'

// Format a number as signed USD currency, e.g., +$5.00 / -$10.00
export function formatCurrency(amount) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      signDisplay: 'always',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(Number(amount) || 0)
  } catch {
    const num = Number(amount) || 0
    const sign = num >= 0 ? '+' : '-'
    return `${sign}$${Math.abs(num).toFixed(2)}`
  }
}

// Validate simple MM/DD/YYYY format (not exhaustive calendar validation)
export function isValidDateMMDDYYYY(value) {
  const re = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/
  return re.test(String(value).trim())
}

// Detect simple ISO date from <input type="date"> (YYYY-MM-DD)
export function isISODateYYYYMMDD(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value).trim())
}

// Convert ISO YYYY-MM-DD to MM/DD/YYYY (no heavy validation here)
export function isoToMMDDYYYY(iso) {
  const [yyyy, mm, dd] = String(iso).trim().split('-')
  if (!yyyy || !mm || !dd) return String(iso)
  return `${mm}/${dd}/${yyyy}`
}

// Normalize any date input value to MM/DD/YYYY
// - If value is ISO (from native date picker), convert to MM/DD/YYYY
// - Otherwise, return trimmed value unchanged
export function normalizeDateInput(value) {
  const v = String(value).trim()
  return isISODateYYYYMMDD(v) ? isoToMMDDYYYY(v) : v
}

// Sanitize and normalize a bet object
export function normalizeBet(raw) {
  return {
    week: Number(raw.week) || 0,
    // Ensure dates are consistently stored/displayed as MM/DD/YYYY
    date: normalizeDateInput(String(raw.date || '').trim()),
    description: String(raw.description || '').trim(),
    opponent: String(raw.opponent || '').trim(),
    outcome: OUTCOMES.includes(String(raw.outcome)) ? String(raw.outcome) : 'pending',
    amount: Number(raw.amount) || 0,
  }
}
