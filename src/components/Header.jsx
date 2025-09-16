import { useEffect, useRef, useState } from 'react'
import { formatCurrency, formatCurrencyUnsigned } from '../utils/format.js'

// Header component: title, total balance, note, and a Settings gear that opens a panel
// with utility actions (Export JSON, Clear Local Data). Mobile-first and accessible.
export default function Header({ totalBalance, onExport, onClear }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const gearRef = useRef(null)
  const firstItemRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!isMenuOpen) return
    function onDocPointerDown(e) {
      if (!menuRef.current) return
      if (menuRef.current.contains(e.target) || gearRef.current?.contains(e.target)) return
      setIsMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocPointerDown)
    document.addEventListener('touchstart', onDocPointerDown)
    return () => {
      document.removeEventListener('mousedown', onDocPointerDown)
      document.removeEventListener('touchstart', onDocPointerDown)
    }
  }, [isMenuOpen])

  // Focus management: when opening, focus the first item; when closing, return to gear
  useEffect(() => {
    if (isMenuOpen) {
      firstItemRef.current?.focus()
    } else {
      gearRef.current?.focus()
    }
  }, [isMenuOpen])

  // Keyboard handling for Escape to close
  useEffect(() => {
    if (!isMenuOpen) return
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  const menuId = 'settings-menu'

  return (
    <header className="header" role="banner">
      <div className="header-row">
        <h1 className="title">NFL Bet Tracker</h1>
        <div className="settings" style={{ position: 'relative' }}>
          <button
            ref={gearRef}
            type="button"
            className="btn settings-gear"
            aria-label="Open settings"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            {/*
              Icon: "gear" (solid) from Font Awesome Free 6
              Link: https://fontawesome.com/icons/gear?s=solid
              Copyright: Fonticons, Inc.
              License: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/
              Notes: Path data is unmodified. Sizing and color are controlled via CSS and currentColor.
            */}
            <svg viewBox="0 0 512 512" aria-hidden="true">
              <path fill="currentColor" d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
            </svg>
          </button>

          {isMenuOpen && (
            <div
              ref={menuRef}
              id={menuId}
              className="settings-panel"
              role="menu"
              aria-label="Settings"
            >
              <button
                ref={firstItemRef}
                type="button"
                className="settings-item"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false)
                  onExport?.()
                }}
              >
                Export Bets (JSON)
              </button>
              <button
                type="button"
                className="settings-item settings-item--danger"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false)
                  onClear?.()
                }}
              >
                Clear Local Data
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="total" aria-live="polite">
        {totalBalance > 0 && (
          <>
            You’re up <strong>{formatCurrency(totalBalance)}</strong> so far
          </>
        )}
        {totalBalance < 0 && (
          <>
            You’re down <strong>{formatCurrencyUnsigned(totalBalance)}</strong> so far
          </>
        )}
        {totalBalance === 0 && (
          <>
            You’re even <strong>{formatCurrencyUnsigned(totalBalance)}</strong> so far
          </>
        )}
      </p>
      <p className="note" role="note">
        Bets you add here are saved only on this device. They won’t show up for other visitors unless the official data file is updated.
      </p>
    </header>
  )
}
