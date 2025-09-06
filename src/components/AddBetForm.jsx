import { useState } from 'react';
import { OUTCOMES } from '../utils/constants.js';
import { isValidDateMMDDYYYY, normalizeDateInput } from '../utils/format.js';

// Add Bet form panel: collapsible. Shows a button when closed and the form when open.
// All fields are required. Uses accessible labels and simple validations.
export default function AddBetForm({ onAdd, isOpen = false, onOpen, onCancel }) {
  const [week, setWeek] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [opponent, setOpponent] = useState('');
  const [outcome, setOutcome] = useState('pending');
  const [amount, setAmount] = useState('');

  function reset() {
    setWeek('');
    setDate('');
    setDescription('');
    setOpponent('');
    setOutcome('pending');
    setAmount('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const weekNum = Number(week);
    const amtNum = Number(amount);
    const normalizedDate = normalizeDateInput(date);

    if (!Number.isInteger(weekNum) || weekNum <= 0)
      return alert(
        'Please enter a valid football week (positive whole number).'
      );
    if (!isValidDateMMDDYYYY(normalizedDate))
      return alert('Please enter a valid date in MM/DD/YYYY format.');
    if (!description.trim()) return alert('Please enter a description.');
    if (!opponent.trim()) return alert('Please enter an opponent name.');
    if (!OUTCOMES.includes(outcome))
      return alert('Please choose a valid outcome.');
    if (Number.isNaN(amtNum))
      return alert(
        'Please enter a valid amount (just the wager size; sign will be determined by outcome).'
      );

    onAdd({
      week: weekNum,
      date: normalizedDate,
      description,
      opponent,
      outcome,
      // Store absolute amount; sign is derived from outcome throughout the app.
      amount: Math.abs(amtNum),
    });
    reset();
    // Auto-close the form after a successful add if a cancel/close handler is provided.
    if (typeof onCancel === 'function') onCancel();
  }

  function handleCancel() {
    reset();
    if (typeof onCancel === 'function') onCancel();
  }

  return (
    <section className="panel" aria-labelledby="add-bet-heading" id="add-bet-panel">
      <h2 id="add-bet-heading" className="section-title">
        New Bet
      </h2>
      {!isOpen ? (
        <div className="actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpen}
            aria-expanded={false}
            aria-controls="add-bet-panel"
          >
            Add New Bet
          </button>
        </div>
      ) : (
        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="fields">
            <div className="field">
              <label htmlFor="week">Week</label>
              <input
                id="week"
                name="week"
                type="number"
                inputMode="numeric"
                min="1"
                placeholder="e.g., 1"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="description">Type/Description</label>
              <input
                id="description"
                name="description"
                type="text"
                placeholder="e.g., Spread bet vs. Ravens"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="opponent">Opponent</label>
              <input
                id="opponent"
                name="opponent"
                type="text"
                placeholder="e.g., Alice"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="outcome">Outcome</label>
              <select
                id="outcome"
                name="outcome"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
              >
                {OUTCOMES.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                name="amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="e.g., 5"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="actions">
            <button type="submit" className="btn btn-primary">
              Add Bet
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
