import { useState, useMemo, useCallback } from 'react'
/**
 * Paginate an array of already filtered items.
 * @template T
 * @param {T[]} items list of items
 * @param {number} pageSize items per page
 * @returns {{page:number,setPage:(n:number|((p:number)=>number))=>void,reset:()=>void,total:number,totalPages:number,startIndex:number,pageItems:T[],pageSize:number}}
 */
export function usePagination(items, pageSize = 10) {
  const [page, setPage] = useState(1)
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const startIndex = (page - 1) * pageSize
  const pageItems = useMemo(() => items.slice(startIndex, startIndex + pageSize), [items, startIndex, pageSize])
  const reset = useCallback(() => setPage(1), [])
  return { page, setPage, reset, total, totalPages, startIndex, pageItems, pageSize }
}