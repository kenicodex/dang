import { useSyncExternalStore } from 'react'

type Listener<T> = (state: T, prevState: T) => void
type Selector<T, U> = (state: T) => U
type EqualityFn<U> = (a: U, b: U) => boolean
type SetStateFn<T> = (next: T | ((prev: T) => T)) => void
type StoreApi<T> = {
  getState: () => T
  setState: SetStateFn<T>
  subscribe: (l: Listener<T>) => () => void
}
type CreateState<T> = (set: SetStateFn<T>, get: () => T, api: StoreApi<T>) => T

export function create<T extends object>(createStateFn: CreateState<T>) {
  let state: T
  const listeners = new Set<Listener<T>>()

  const setState: SetStateFn<T> = next => {
    const prev = state
    const computed = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
    if (Object.is(prev, computed)) return
    state = { ...prev, ...computed } as T
    listeners.forEach(l => l(state, prev))
  }

  const getState = () => state
  const subscribe = (l: Listener<T>) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  }

  const api: StoreApi<T> = { getState, setState, subscribe }
  state = createStateFn(setState, getState, api)

  function useStore(): T
  function useStore<U>(selector: Selector<T, U>, equals?: EqualityFn<U>): U
  function useStore<U>(selector?: Selector<T, U>, equals: EqualityFn<U> = Object.is): U | T {
    return useSyncExternalStore(
      cb => {
        let prev: T = state
        return subscribe(nextState => {
          const prevSlice = selector ? selector(prev) : prev
          const nextSlice = selector ? selector(nextState) : nextState
          if (!equals(prevSlice as U, nextSlice as U)) {
            prev = nextState
            cb()
          }
        })
      },
      () => (selector ? selector(state) : state),
      () => (selector ? selector(state) : state),
    ) as U | T
  }

  useStore.getState = getState
  useStore.setState = setState
  useStore.subscribe = subscribe

  return useStore
}
