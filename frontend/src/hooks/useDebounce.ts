import { useEffect, useState } from 'react'

/**
 * Custom hook untuk debouncing nilai input
 * Berguna untuk search/filter yang membutuhkan API call
 * 
 * @param value - Nilai yang akan di-debounce
 * @param delay - Delay dalam milliseconds (default: 500ms)
 * @returns Debounced value
 * 
 * @example
 * const [search, setSearch] = useState('')
 * const debouncedSearch = useDebounce(search, 500)
 * 
 * useEffect(() => {
 *   // API call dengan debouncedSearch
 * }, [debouncedSearch])
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set timeout untuk update debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: cancel timeout jika value berubah sebelum delay selesai
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
