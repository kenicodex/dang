import { create } from './zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

export interface SheetState {
  id: string
  isOpen: boolean
}

export interface UIState {
  toasts: Toast[]
  activeSheet: SheetState | null
  isOffline: boolean
  colorScheme: 'light' | 'dark' | 'system'
  showToast: (message: string, type?: ToastType, duration?: number) => void
  dismissToast: (id: string) => void
  openSheet: (id: string) => void
  closeSheet: () => void
  setOffline: (offline: boolean) => void
  setColorScheme: (scheme: UIState['colorScheme']) => void
}

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  activeSheet: null,
  isOffline: false,
  colorScheme: 'system',
  showToast: (message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).slice(2)
    set({ toasts: [...get().toasts, { id, message, type, duration }] })
    if (duration > 0) {
      setTimeout(() => {
        set({ toasts: get().toasts.filter(t => t.id !== id) })
      }, duration)
    }
  },
  dismissToast: id => set({ toasts: get().toasts.filter(t => t.id !== id) }),
  openSheet: id => set({ activeSheet: { id, isOpen: true } }),
  closeSheet: () => set({ activeSheet: null }),
  setOffline: isOffline => set({ isOffline }),
  setColorScheme: colorScheme => set({ colorScheme }),
}))
