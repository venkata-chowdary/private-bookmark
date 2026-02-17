'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AuthButton({ user }: { user: any }) {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        setLoading(true)
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
        setLoading(false)
    }

    const handleLogout = async () => {
        setLoading(true)
        await supabase.auth.signOut()
        router.refresh()
        setLoading(false)
    }

    return (
        <div className="flex items-center gap-4">
            {user ? (
                <div className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-full border border-border bg-secondary/50 backdrop-blur-sm transition-all hover:bg-secondary">
                    <div className="flex flex-col items-end pr-2">
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Signed in as</span>
                        <span className="text-xs font-semibold text-foreground max-w-[120px] truncate">{user.email}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Sign Out"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="btn-primary rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                >
                    {loading ? 'Connecting...' : 'Sign in with Google'}
                </button>
            )}
        </div>
    )
}
