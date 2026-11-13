import { CHIME_VOLUME, TICK_VOLUME } from '../config'

// All sounds are synthesized; there are no audio files.
let ctx: AudioContext | null = null
let master: GainNode | null = null
let muted = false

/** Must run inside a user gesture: browsers keep audio suspended until then. */
export function unlockAudio(): void {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = muted ? 0 : 1
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
}

/** Takes effect immediately, including sounds already playing. */
export function setMuted(value: boolean): void {
  muted = value
  if (ctx && master) master.gain.setValueAtTime(value ? 0 : 1, ctx.currentTime)
}

function blip(freq: number, start: number, duration: number, peak: number, type: OscillatorType): void {
  if (!ctx || !master) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(gain).connect(master)
  osc.start(start)
  osc.stop(start + duration + 0.02)
}

export function playTick(): void {
  if (muted || !ctx) return
  blip(1700, ctx.currentTime, 0.04, TICK_VOLUME * 0.5, 'triangle')
}

export function playChime(): void {
  if (muted || !ctx) return
  const now = ctx.currentTime
  const notes = [1046.5, 1318.5, 1568, 2093] // C6 E6 G6 C7
  notes.forEach((freq, k) => blip(freq, now + k * 0.08, 0.55, CHIME_VOLUME * 0.3, 'sine'))
}
