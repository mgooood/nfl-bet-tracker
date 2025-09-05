import { useState } from 'react'
import { formatCurrency, formatCurrencyUnsigned, signedAmountForBet } from '../utils/format.js'
import { OUTCOMES } from '../utils/constants.js'

// A single bet row with inline edit for outcome and amount only.
export default function BetRow({ bet, index, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [editOutcome, setEditOutcome] = useState(bet.outcome)
  const [editAmount, setEditAmount] = useState(String(Math.abs(bet.amount)))

  function handleSave() {
    const amt = Math.abs(Number(editAmount))
    if (Number.isNaN(amt)) return alert('Please enter a valid amount.')
    if (!OUTCOMES.includes(editOutcome)) return alert('Please choose a valid outcome.')
    onUpdate(index, { amount: amt, outcome: editOutcome })
    setEditing(false)
  }

  function handleCancel() {
    setEditOutcome(bet.outcome)
    setEditAmount(String(Math.abs(bet.amount)))
    setEditing(false)
  }

  // Choose a subtle visual modifier based on the outcome
  const outcomeClass = bet.outcome === 'win' ? 'bet--win' : bet.outcome === 'loss' ? 'bet--loss' : ''

  return (
    <article className={`bet ${outcomeClass}`} aria-label={`Bet vs ${bet.opponent} on ${bet.date}`}>
      <div className="bet-grid">
        <div className="bet-field">
          <span className="label">Week</span>
          <span className="value">{bet.week}</span>
        </div>
        <div className="bet-field">
          <span className="label">Date</span>
          <span className="value">{bet.date}</span>
        </div>
        <div className="bet-field">
          <span className="label">Type/Description</span>
          <span className="value">{bet.description}</span>
        </div>
        <div className="bet-field">
          <span className="label">Opponent</span>
          <span className="value">{bet.opponent}</span>
        </div>
        <div className="bet-field">
          <span className="label">Outcome</span>
          {editing ? (
            <select value={editOutcome} onChange={(e) => setEditOutcome(e.target.value)} aria-label="Edit outcome">
              {OUTCOMES.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          ) : (
            <span className="value">{bet.outcome}</span>
          )}
        </div>
        <div className="bet-field">
          <span className="label">Amount</span>
          {editing ? (
            <input type="number" inputMode="decimal" step="0.01" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} aria-label="Edit amount" />
          ) : (
            bet.outcome === 'pending' ? (
              <span className="value" title="Pending (excluded from totals)">{formatCurrencyUnsigned(bet.amount)}</span>
            ) : (
              <span className={signedAmountForBet(bet) >= 0 ? 'value positive' : 'value negative'}>{formatCurrency(signedAmountForBet(bet))}</span>
            )
          )}
        </div>
      </div>
      <div className="bet-actions">
        {editing ? (
          <>
            <button className="btn btn-primary" onClick={handleSave} aria-label="Save bet changes">Save</button>
            <button className="btn btn-secondary" onClick={handleCancel} aria-label="Cancel editing">Cancel</button>
          </>
        ) : (
          <button className="btn btn-secondary" onClick={() => setEditing(true)} aria-label="Edit bet">Edit</button>
        )}
      </div>
    </article>
  )
}
