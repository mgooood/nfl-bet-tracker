import { formatCurrency } from '../utils/format.js'

// Opponent summary: displays unique opponents and their balances.
export default function OpponentSummary({ summary }) {
  return (
    <section className="panel" aria-labelledby="opponent-summary-heading">
      <h2 id="opponent-summary-heading" className="section-title">Opponent Balances</h2>
      {!summary || summary.length === 0 ? (
        <p className="muted">No opponents yet.</p>
      ) : (
        <ul className="summary-list" role="list">
          {summary.map(([name, balance]) => (
            <li key={name} className="summary-item">
              <span className="summary-name">{name}</span>
              <span className={balance >= 0 ? 'summary-amount positive' : 'summary-amount negative'}>
                {formatCurrency(balance)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
