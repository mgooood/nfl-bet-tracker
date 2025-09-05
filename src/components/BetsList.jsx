import BetRow from './BetRow.jsx'

// List of bets rendered as cards
export default function BetsList({ bets, onUpdate }) {
  if (!bets || bets.length === 0) {
    return (
      <section className="panel" aria-labelledby="bets-list-heading">
        <h2 id="bets-list-heading" className="section-title">All Bets</h2>
        <p className="muted">No bets yet. Add your first bet above.</p>
      </section>
    )
  }

  return (
    <section className="panel" aria-labelledby="bets-list-heading">
      <h2 id="bets-list-heading" className="section-title">All Bets</h2>
      <ul className="bets" role="list">
        {bets.map((bet, index) => (
          <li key={index} className="bet-card">
            <BetRow bet={bet} index={index} onUpdate={onUpdate} />
          </li>
        ))}
      </ul>
    </section>
  )
}
