import { useEffect, useRef, useState } from 'preact/hooks'
import { DEFAULT_OPTIONS, MIN_OPTIONS, REDUCED_MOTION_SPIN_MS, SPIN_MS, TEXT } from './config'
import { OptionsDialog } from './components/OptionsDialog'
import { ResultDialog } from './components/ResultDialog'
import { Wheel } from './components/Wheel'
import { ease, mod, pickIndex, sliceAngle, spinDelta } from './lib/spin'
import { playChime, playTick, setMuted as setSoundMuted, unlockAudio } from './lib/sound'
import { readOptions, writeOptions } from './lib/url'
import logoUrl from './assets/logo.webp'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function App() {
  const [options, setOptions] = useState<string[]>(readOptions)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<number | null>(null)
  const [hasSpun, setHasSpun] = useState(false)
  const [muted, setMuted] = useState(false)
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [fontsReady, setFontsReady] = useState(false)

  const rotationRef = useRef(0)
  const frameRef = useRef(0)

  useEffect(() => writeOptions(options), [options])

  useEffect(() => {
    let alive = true
    void document.fonts?.ready.then(() => alive && setFontsReady(true))
    // The pop-up fonts are only used inside dialogs; load them early so the first result doesn't flash a fallback.
    for (const family of ['Anton', 'Neuropol']) void document.fonts?.load(`16px "${family}"`).catch(() => {})
    return () => {
      alive = false
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const applyRotation = (value: number) => {
    rotationRef.current = value
    setRotation(value)
  }

  const spin = () => {
    if (spinning || optionsOpen || winner !== null) return
    unlockAudio()

    const n = options.length
    const a = sliceAngle(n)
    const index = pickIndex(n)
    const start = rotationRef.current
    const delta = spinDelta(start, index, n)
    const reduced = reducedMotion()
    const duration = reduced ? REDUCED_MOTION_SPIN_MS : SPIN_MS
    const t0 = performance.now()
    let lastSlice = Math.floor(start / a)

    setSpinning(true)
    setHasSpun(true)

    const frame = (now: number) => {
      const t = Math.min(1, (now - t0) / duration)
      const angle = start + delta * ease(t)
      applyRotation(angle)

      const slice = Math.floor(angle / a)
      if (slice !== lastSlice) {
        lastSlice = slice
        if (!reduced) playTick()
      }

      if (t < 1) {
        frameRef.current = requestAnimationFrame(frame)
      } else {
        applyRotation(mod(angle, 360))
        setSpinning(false)
        playChime()
        setWinner(index)
      }
    }
    frameRef.current = requestAnimationFrame(frame)
  }

  const removeWinner = () => {
    if (winner === null || options.length <= MIN_OPTIONS) return
    setOptions(options.filter((_, k) => k !== winner))
    setWinner(null)
  }

  const saveOptions = (list: string[]) => {
    setOptions(list)
    applyRotation(0)
    setOptionsOpen(false)
  }

  const restoreDefaults = () => saveOptions([...DEFAULT_OPTIONS])

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    setSoundMuted(next)
  }

  return (
    <>
      <div class="toolbar">
        <button
          type="button"
          class="icon-button"
          aria-label={muted ? TEXT.unmute : TEXT.mute}
          title={muted ? TEXT.unmute : TEXT.mute}
          aria-pressed={muted}
          onClick={toggleMute}
        >
          {muted ? <SpeakerOffIcon /> : <SpeakerIcon />}
        </button>
        <button
          type="button"
          class="icon-button"
          aria-label={TEXT.editOptions}
          title={TEXT.editOptions}
          disabled={spinning}
          onClick={() => setOptionsOpen(true)}
        >
          <GearIcon />
        </button>
      </div>

      <main class="page">
        <div class="logo-card">
          <img src={logoUrl} alt={TEXT.logoAlt} width={1200} height={355} />
        </div>
        <Wheel
          options={options}
          rotation={rotation}
          showHint={!hasSpun && !spinning}
          disabled={spinning}
          fontsReady={fontsReady}
          onSpin={spin}
        />
      </main>

      <ResultDialog
        winner={winner === null ? null : options[winner]}
        canRemove={options.length > MIN_OPTIONS}
        onRemove={removeWinner}
        onClose={() => setWinner(null)}
      />
      <OptionsDialog
        open={optionsOpen}
        options={options}
        onSave={saveOptions}
        onRestore={restoreDefaults}
        onClose={() => setOptionsOpen(false)}
      />
    </>
  )
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  )
}

function SpeakerOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4z" />
      <path d="m16 9 6 6" />
      <path d="m22 9-6 6" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
