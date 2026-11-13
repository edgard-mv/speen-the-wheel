import { DEFAULT_OPTIONS, MIN_OPTIONS } from '../config'

const PARAM = 'o'

export function cleanOptions(lines: readonly string[]): string[] {
  return lines.map((line) => line.trim()).filter((line) => line.length > 0)
}

function isDefaultList(list: readonly string[]): boolean {
  return list.length === DEFAULT_OPTIONS.length && list.every((item, i) => item === DEFAULT_OPTIONS[i])
}

/** Options from the query string, or the defaults when there are fewer than 2 usable entries. */
export function readOptions(): string[] {
  const fromUrl = cleanOptions(new URLSearchParams(location.search).getAll(PARAM))
  return fromUrl.length >= MIN_OPTIONS ? fromUrl : [...DEFAULT_OPTIONS]
}

/** Mirrors the list into the address bar without a reload; the default list means no `o` params. */
export function writeOptions(list: readonly string[]): void {
  const url = new URL(location.href)
  url.searchParams.delete(PARAM)
  if (!isDefaultList(list)) {
    for (const item of list) url.searchParams.append(PARAM, item)
  }
  if (url.href !== location.href) history.replaceState(history.state, '', url)
}
