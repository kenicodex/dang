export function formatCurrency(
  amount: number,
  currency: 'NGN' | 'GBP' | 'USD' | 'EUR' = 'NGN',
  opts?: { maximumFractionDigits?: number },
): string {
  const fractionDigits = opts?.maximumFractionDigits ?? 0
  const localeMap: Record<string, string> = {
    NGN: 'en-NG',
    GBP: 'en-GB',
    USD: 'en-US',
    EUR: 'en-IE',
  }
  try {
    return new Intl.NumberFormat(localeMap[currency] ?? 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: fractionDigits,
    }).format(amount)
  } catch {
    const symbols: Record<string, string> = { NGN: '₦', GBP: '£', USD: '$', EUR: '€' }
    return `${symbols[currency] ?? ''}${amount.toFixed(fractionDigits)}`
  }
}

export function formatCompactNumber(n: number): string {
  try {
    return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
  } catch {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return String(n)
  }
}

export function formatInitials(name: string | null | undefined, max = 2): string {
  if (!name) return '??'
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, max)
    .map(s => s[0]?.toUpperCase() ?? '')
    .join('')
    .padEnd(1, '?')
    .slice(0, max)
}

export function truncate(input: string, max: number, ellipsis = '…'): string {
  if (input.length <= max) return input
  return `${input.slice(0, max - ellipsis.length)}${ellipsis}`
}

export function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text)
  }
  return new Promise((resolve, reject) => {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}
