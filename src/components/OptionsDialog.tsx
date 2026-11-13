import { useEffect, useRef, useState } from 'preact/hooks'
import { MIN_OPTIONS, TEXT, WARN_OPTIONS } from '../config'
import { cleanOptions } from '../lib/url'

type Props = {
  open: boolean
  options: readonly string[]
  onSave: (list: string[]) => void
  onRestore: () => void
  onClose: () => void
}

export function OptionsDialog({ open, options, onSave, onRestore, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const [draft, setDraft] = useState('')
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open) {
      setDraft(options.join('\n'))
      setCopyState('idle')
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
    }
    // Only reset the draft when the dialog opens, not when options change underneath it.
  }, [open])

  useEffect(() => {
    if (copyState !== 'copied') return
    const id = setTimeout(() => setCopyState('idle'), 2000)
    return () => clearTimeout(id)
  }, [copyState])

  const list = cleanOptions(draft.split('\n'))
  const tooFew = list.length < MIN_OPTIONS
  const tooMany = list.length > WARN_OPTIONS

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(location.href)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <dialog ref={ref} aria-labelledby="options-title" onClose={onClose}>
      <h2 id="options-title" class="dialog-title">
        {TEXT.optionsTitle}
      </h2>
      <label class="options-help" for="options-text">
        {TEXT.optionsHelp}
      </label>
      <textarea
        id="options-text"
        class="options-text"
        value={draft}
        spellcheck={false}
        onInput={(e) => setDraft(e.currentTarget.value)}
      />
      <div class="options-meta" aria-live="polite">
        <span>{TEXT.optionsCount(list.length)}</span>
        {tooFew && <span class="error">{TEXT.validation}</span>}
        {tooMany && <span class="warning">{TEXT.tooMany}</span>}
      </div>
      <div class="options-tools">
        <button type="button" class="text-button" onClick={onRestore}>
          {TEXT.restoreDefaults}
        </button>
        <button type="button" class="text-button" onClick={copyLink}>
          {TEXT.copyLink}
        </button>
        <span class={`copy-status${copyState === 'failed' ? ' error' : ''}`} aria-live="polite">
          {copyState === 'copied' ? TEXT.linkCopied : copyState === 'failed' ? TEXT.copyFailed : ''}
        </span>
      </div>
      <div class="dialog-actions">
        <button type="button" class="btn" onClick={onClose}>
          {TEXT.cancel}
        </button>
        <button type="button" class="btn primary" disabled={tooFew} onClick={() => onSave(list)}>
          {TEXT.save}
        </button>
      </div>
    </dialog>
  )
}
