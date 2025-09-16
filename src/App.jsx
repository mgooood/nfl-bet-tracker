import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import OpponentSummary from './components/OpponentSummary.jsx'
import AddBetForm from './components/AddBetForm.jsx'
import BetsList from './components/BetsList.jsx'
import { readLocalBets, saveLocalBets, fetchPublicBets, clearLocalBets } from './utils/storage.js'
import { normalizeBet, signedAmountForBet } from './utils/format.js'

function App() {
  // State for the bets list and data loading
  const [bets, setBets] = useState([])
  const [loaded, setLoaded] = useState(false)
  // Controls visibility of the "Add New Bet" form panel
  const [isAddBetOpen, setIsAddBetOpen] = useState(false)

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

  // Explicit controls for opening/closing the Add New Bet panel
  function handleOpenAddBet() {
    setIsAddBetOpen(true)
  }

  function handleCloseAddBet() {
    setIsAddBetOpen(false)
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

  // Clear local storage and immediately reseed from the official public data (Option B).
  // We briefly set `loaded` to false to pause the persistence effect so we don't
  // write an empty array back to storage during the transition. This keeps the
  // side-effects minimal and predictable.
  async function handleClear() {
    const confirmed = window.confirm(
      'This will remove your local changes on this device and reload official seed data. Continue?'
    )
    if (!confirmed) return

    try {
      // Pause persistence and show immediate UI feedback
      setLoaded(false)
      setBets([])
      clearLocalBets()

      // Reseed from public/bets.json and restore normal persistence
      const seeded = await fetchPublicBets()
      setBets(seeded)
      setLoaded(true)
    } catch {
      // In case of a fetch error we still leave the UI empty and re-enable persistence
      setLoaded(true)
    }
  }

  return (
    <div className="app">
      <Header totalBalance={totalBalance} onExport={handleExport} onClear={handleClear} />
      <main className="content" role="main">
        <OpponentSummary summary={opponentSummary} />
        <AddBetForm
          isOpen={isAddBetOpen}
          onOpen={handleOpenAddBet}
          onCancel={handleCloseAddBet}
          onAdd={handleAddBet}
        />
        <BetsList bets={bets} onUpdate={handleUpdateBet} />
      </main>
    </div>
  )
}
export default App
