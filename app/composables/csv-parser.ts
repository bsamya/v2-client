import Papa from 'papaparse'
import type { ParseResult } from 'papaparse'

export function useCsvParser() {
  const parseCsv = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,          // convert first row to keys
        skipEmptyLines: true,
        complete: (results: ParseResult<any>) => resolve(results.data),
        error: (err: Error) => reject(err)
      })
    })
  }

  const downloadCsv = (data: any[], filename = 'export.csv') => {
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
  }

  return { parseCsv, downloadCsv }
}
