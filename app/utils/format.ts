export function fullDate(date: unknown): string {
  if (!date || !(date instanceof Date)) return ''
  const adapter = useDate()
  return adapter.format(date, 'fullDate')
}