// Simplified version of use-toast.ts
import { useState, useEffect } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, duration = 3000 }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prevToasts) => [...prevToasts, { id, title, description, duration }])
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setToasts((prevToasts) =>
        prevToasts.filter((toast) => {
          const elapsedTime = Date.now() - parseInt(toast.id, 36)
          return elapsedTime < (toast.duration || 3000)
        })
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return { toast, toasts }
}