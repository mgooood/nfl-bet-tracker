import { formatCurrency } from '../utils/format.js'

// Header component: title, export button, total balance, and persistence note.
export default function Header({ totalBalance, onExport }) {
  return (
    <header className="header" role="banner">
      <div className="header-row">
        <h1 className="title">NFL Bet Tracker</h1>
        <button className="btn btn-primary" onClick={onExport} aria-label="Export bets as JSON">
          Export Data
        </button>
      </div>
      <p className="total" aria-live="polite">
        Total Balance: <strong>{formatCurrency(totalBalance)}</strong>
      </p>
      <p className="note" role="note">
        Bets you add here are saved only on this device. They won’t show up for other visitors unless the official data file is updated.
      </p>
    </header>
  )
}
