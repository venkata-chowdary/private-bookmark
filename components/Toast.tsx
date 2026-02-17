'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts((prev) => [...prev, { id, message, type }])

        // Auto dismiss after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 3000)
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
              min-w-[300px] px-4 py-3 rounded-lg shadow-lg border text-sm font-medium animate-in slide-in-from-right-full fade-in duration-300
              ${toast.type === 'success'
                                ? 'bg-background text-foreground border-border shadow-sm ring-1 ring-black/5'
                                : toast.type === 'error'
                                    ? 'bg-destructive text-destructive-foreground border-destructive'
                                    : 'bg-secondary text-secondary-foreground border-border'}
            `}
                    >
                        <div className="flex items-center gap-2">
                            {toast.type === 'success' && (
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            )}
                            {toast.type === 'error' && (
                                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            )}
                            {toast.message}
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
