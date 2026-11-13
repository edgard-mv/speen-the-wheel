import { EXTRA_TURNS } from '../config'

/** Positive remainder, so angles always land in [0, m). */
export function mod(x: number, m: number): number {
  return ((x % m) + m) % m
}

function randomUint32(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0]
}

/** Uniform in [0, 1). */
function randomUnit(): number {
  return randomUint32() / 2 ** 32
}

/** Winner is picked before animating, so easing can't bias the result. */
export function pickIndex(n: number): number {
  return randomUint32() % n
}

export function sliceAngle(n: number): number {
  return 360 / n
}

/**
 * Clockwise rotation (degrees) that lands the middle of slice `i`, plus a random
 * offset inside the slice, under the pointer at 3 o'clock after several full turns.
 * Slice k spans [k·a, (k+1)·a] measured clockwise from 3 o'clock.
 */
export function spinDelta(currentRotation: number, i: number, n: number): number {
  const a = sliceAngle(n)
  const jitter = (randomUnit() - 0.5) * 0.8 // [-0.4, 0.4) of a slice
  const turns = EXTRA_TURNS[randomUint32() % EXTRA_TURNS.length]
  const target = -(i + 0.5 + jitter) * a
  return mod(target - currentRotation, 360) + 360 * turns
}

/** Quartic ease-out. */
export function ease(t: number): number {
  return 1 - (1 - t) ** 4
}
