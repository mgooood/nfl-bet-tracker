import { STORAGE_KEY } from './constants.js'
import { normalizeBet } from './format.js'

// Read bets from localStorage; return null if not present or invalid
export function readLocalBets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed.map(normalizeBet)
  } catch {
    return null
  }
}

// Save bets to localStorage (best-effort)
export function saveLocalBets(bets) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bets))
  } catch {
    // ignore write errors (e.g., storage full or denied)
  }
}

// Fetch initial bets from public/bets.json and normalize
export async function fetchPublicBets(baseUrl = import.meta.env.BASE_URL || '/') {
  const url = baseUrl + 'bets.json'
  try {
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data.map(normalizeBet) : []
  } catch {
    return []
  }
}

// Clear only this app's stored bets key from localStorage.
// Avoid using localStorage.clear() to not wipe other apps on the same origin.
export function clearLocalBets() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore errors (e.g., storage disabled)
  }
}
