import { useMemo } from 'preact/hooks'
import { COLORS, SLICE_STYLES, TEXT } from '../config'
import { sliceAngle } from '../lib/spin'

// SVG geometry, in viewBox units. The extra 40 units on the right hold the pointer.
const CX = 200
const CY = 200
const R = 182
const HUB_R = R * 0.2
const LABEL_END = R - 14
const LABEL_START = HUB_R + 12
const LABEL_SPACE = LABEL_END - LABEL_START
const MAX_FONT = 30
const MIN_FONT = 9

type Props = {
  options: readonly string[]
  rotation: number
  showHint: boolean
  disabled: boolean
  fontsReady: boolean
  onSpin: () => void
}

let measureCtx: CanvasRenderingContext2D | null = null
function textWidth(text: string, fontSize: number): number {
  measureCtx ??= document.createElement('canvas').getContext('2d')
  if (!measureCtx) return text.length * fontSize * 0.42
  measureCtx.font = `${fontSize}px "Bebas Neue", Anton, sans-serif`
  return measureCtx.measureText(text).width
}

/** Sizes a label to its slice, then truncates with "…" if it still doesn't fit. */
function fitLabel(text: string, n: number): { text: string; fontSize: number } {
  const halfAngle = (sliceAngle(n) / 2) * (Math.PI / 180)
  const thickness = 2 * (R * 0.62) * Math.sin(Math.min(halfAngle, Math.PI / 2))
  let fontSize = Math.max(MIN_FONT, Math.min(MAX_FONT, thickness * 0.62))

  const full = textWidth(text, fontSize)
  if (full <= LABEL_SPACE) return { text, fontSize }

  // Shrink a little before truncating, but keep labels readable.
  fontSize = Math.max(Math.min(fontSize, 18), fontSize * (LABEL_SPACE / full))
  if (textWidth(text, fontSize) <= LABEL_SPACE) return { text, fontSize }

  let cut = text
  while (cut.length > 1 && textWidth(`${cut}…`, fontSize) > LABEL_SPACE) cut = cut.slice(0, -1)
  return { text: `${cut.trimEnd()}…`, fontSize }
}

/** Gold, white, sky; when n % 3 === 1 the last slice turns white so it never touches the gold first slice. */
function sliceStyle(k: number, n: number) {
  if (n % 3 === 1 && k === n - 1) return SLICE_STYLES[1]
  return SLICE_STYLES[k % SLICE_STYLES.length]
}

function point(angleDeg: number, radius: number): string {
  const rad = (angleDeg * Math.PI) / 180
  return `${(CX + radius * Math.cos(rad)).toFixed(3)} ${(CY + radius * Math.sin(rad)).toFixed(3)}`
}

function Slices({ options }: { options: readonly string[] }) {
  const n = options.length
  const a = sliceAngle(n)
  return (
    <>
      {options.map((option, k) => {
        const style = sliceStyle(k, n)
        const start = k * a
        const end = (k + 1) * a
        const mid = start + a / 2
        const label = fitLabel(option, n)
        return (
          <g key={k}>
            <path
              d={`M ${CX} ${CY} L ${point(start, R)} A ${R} ${R} 0 0 1 ${point(end, R)} Z`}
              fill={style.fill}
              stroke={COLORS.white}
              stroke-width={2}
              stroke-linejoin="round"
            />
            <text
              class="slice-label"
              x={CX + LABEL_END}
              y={CY}
              text-anchor="end"
              dominant-baseline="central"
              font-size={label.fontSize}
              fill={style.label}
              transform={`rotate(${mid} ${CX} ${CY})`}
            >
              {label.text}
            </text>
          </g>
        )
      })}
    </>
  )
}

export function Wheel({ options, rotation, showHint, disabled, fontsReady, onSpin }: Props) {
  // Slices only re-render when the options change or the label font finishes loading
  // (labels are measured with it), not on every animation frame.
  const slices = useMemo(() => <Slices options={options} />, [options, fontsReady])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSpin()
    }
  }

  return (
    <svg
      class="wheel"
      viewBox="0 0 440 400"
      role="button"
      tabIndex={0}
      aria-label={TEXT.wheelLabel}
      aria-disabled={disabled}
      onClick={onSpin}
      onKeyDown={onKeyDown}
    >
      <g transform={`rotate(${rotation} ${CX} ${CY})`}>{slices}</g>
      <circle class="rim" cx={CX} cy={CY} r={R + 4} fill="none" stroke={COLORS.amber} stroke-width={8} />
      <circle cx={CX} cy={CY} r={HUB_R} fill={COLORS.navy} stroke={COLORS.sunGold} stroke-width={5} />
      <polygon
        points={`${CX + R - 8},${CY} ${CX + R + 34},${CY - 20} ${CX + R + 34},${CY + 20}`}
        fill={COLORS.sunYellow}
        stroke={COLORS.navy}
        stroke-width={3}
        stroke-linejoin="round"
      />
      {showHint && (
        <text class="hint" x={CX} text-anchor="middle">
          <tspan x={CX} y={CY - 8}>
            {TEXT.hintLine1.toUpperCase()}
          </tspan>
          <tspan x={CX} y={CY + 32}>
            {TEXT.hintLine2.toUpperCase()}
          </tspan>
        </text>
      )}
    </svg>
  )
}
