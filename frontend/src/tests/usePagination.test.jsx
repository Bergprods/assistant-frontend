import { renderHook, act } from '@testing-library/react'
import { usePagination } from '@hooks'

describe('usePagination', () => {
  it('paginates and resets', () => {
    const items = Array.from({length:25}, (_,i)=>i+1)
    const { result } = renderHook(()=> usePagination(items, 10))
    expect(result.current.total).toBe(25)
    act(()=> result.current.setPage(3))
    expect(result.current.page).toBe(3)
    expect(result.current.pageItems[0]).toBe(21)
    act(()=> result.current.reset())
    expect(result.current.page).toBe(1)
  })
  it('handles empty list', () => {
    const { result } = renderHook(()=> usePagination([], 5))
    expect(result.current.total).toBe(0)
    expect(result.current.pageItems.length).toBe(0)
  })
})
