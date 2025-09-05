import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import OpponentSummary from './components/OpponentSummary.jsx'
import AddBetForm from './components/AddBetForm.jsx'
import BetsList from './components/BetsList.jsx'
import { readLocalBets, saveLocalBets, fetchPublicBets } from './utils/storage.js'
import { normalizeBet, signedAmountForBet } from './utils/format.js'

function App() {
  // State for the bets list and data loading
  const [bets, setBets] = useState([])
  const [loaded, setLoaded] = useState(false)

  // On first load: try localStorage; if missing, seed from public/bets.json
  useEffect(() => {
    const local = readLocalBets()
    if (local) {
      setBets(local)
      setLoaded(true)
      return
    }
    // Use Vite's BASE_URL to correctly resolve public assets on GitHub Pages project pages
    fetchPublicBets()
      .then((seeded) => {
        setBets(seeded)
        saveLocalBets(seeded)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  // Persist any changes to localStorage once initial load has completed
  useEffect(() => {
    if (loaded) saveLocalBets(bets)
  }, [bets, loaded])

  // Derived totals (exclude pending bets from balances and summaries)
  const finalizedBets = useMemo(() => {
    return bets.filter((bet) => bet.outcome !== 'pending')
  }, [bets])

  const totalBalance = useMemo(() => {
    // Sum signed amounts derived from the outcome.
    return finalizedBets.reduce((sum, bet) => sum + signedAmountForBet(bet), 0)
  }, [finalizedBets])

  const opponentSummary = useMemo(() => {
    const map = new Map()
    for (const bet of finalizedBets) {
      const key = bet.opponent?.trim() || 'Unknown'
      const amt = signedAmountForBet(bet)
      map.set(key, (map.get(key) || 0) + amt)
    }
    return Array.from(map.entries()).sort((aEntry, bEntry) => aEntry[0].localeCompare(bEntry[0]))
  }, [finalizedBets])

  // Handlers
  function handleAddBet(newBet) {
    setBets((prev) => [normalizeBet(newBet), ...prev])
  }

  function handleUpdateBet(index, updates) {
    setBets((previousBets) =>
      previousBets.map((bet, i) => (i === index ? normalizeBet({ ...bet, ...updates }) : bet))
    )
  }

  function handleExport() {
    const json = JSON.stringify(bets, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const ts = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `bets-export-${ts}.json`
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      <Header totalBalance={totalBalance} onExport={handleExport} />
      <main className="content" role="main">
        <OpponentSummary summary={opponentSummary} />
        <AddBetForm onAdd={handleAddBet} />
        <BetsList bets={bets} onUpdate={handleUpdateBet} />
      </main>
    </div>
  )
}
export default App
