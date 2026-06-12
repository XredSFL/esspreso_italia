// Auto-imported by Nuxt (utils/). Indonesian-locale formatters for prices and dates.

export function formatRupiah(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return 'Hubungi kami'
  const num = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(num)) return 'Hubungi kami'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
