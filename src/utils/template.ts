/** Replaces `{{key}}` placeholders with values from `dict`. */
export function translate(template: string, dict: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => dict[key] ?? '')
}

export function buildQuery(params: Record<string, string | number | boolean>): string {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')
}

/** Expands `$1`-style capture references from a RegExp match. */
export function expandMatch(template: string, match: RegExpMatchArray): string {
  return template.replace(/\$(\d+)/g, (_, n: string) => match[Number(n)] ?? '')
}
