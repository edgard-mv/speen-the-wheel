import { useEffect, useRef } from 'preact/hooks'
import { TEXT } from '../config'

type Props = {
  winner: string | null
  canRemove: boolean
  onRemove: () => void
  onClose: () => void
}

export function ResultDialog({ winner, canRemove, onRemove, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const open = winner !== null

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog ref={ref} aria-labelledby="result-title" onClose={onClose}>
      <h2 id="result-title" class="dialog-title">
        {TEXT.resultTitle}
      </h2>
      <p class="winner">{winner}</p>
      <div class="dialog-actions">
        <button type="button" class="btn" disabled={!canRemove} onClick={onRemove}>
          {TEXT.remove}
        </button>
        <button type="button" class="btn primary" autofocus onClick={onClose}>
          {TEXT.close}
        </button>
      </div>
    </dialog>
  )
}
