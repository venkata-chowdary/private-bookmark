'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

interface Bookmark {
    id: string
    title: string
    url: string
    created_at: string
}

export default function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const supabase = createClient()
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)

    useEffect(() => {
        setBookmarks(initialBookmarks)
    }, [initialBookmarks])

    useEffect(() => {
        const channel = supabase
            .channel('realtime bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    console.log('Realtime payload received:', payload)
                    if (payload.eventType === 'INSERT') {
                        console.log('Handling INSERT event. Payload new:', payload.new)
                        setBookmarks((prev) => {
                            console.log('Previous bookmarks:', prev)
                            const newB = [payload.new as Bookmark, ...prev]
                            console.log('New bookmarks list length:', newB.length)
                            return newB
                        })
                    } else if (payload.eventType === 'DELETE') {
                        console.log('Handling DELETE event')
                        setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== payload.old.id))
                    }
                }
            )
            .subscribe((status) => {
                console.log('Realtime subscription status:', status)
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    useEffect(() => {
        console.log('Current bookmarks state:', bookmarks)
    }, [bookmarks])

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('bookmarks').delete().eq('id', id)
        if (error) {
            console.error('Error deleting bookmark:', error)
            alert('Error deleting bookmark')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Your Bookmarks
                </h2>
                <span className="px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full border border-border">
                    {bookmarks.length}
                </span>
            </div>

            {bookmarks.length === 0 ? (
                <div className="border border-dashed border-border rounded-xl p-12 text-center bg-muted/20">
                    <div className="mx-auto w-10 h-10 text-muted-foreground/50 mb-3 bg-secondary rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                        </svg>
                    </div>
                    <p className="text-sm text-muted-foreground">No bookmarks yet</p>
                </div>
            ) : (
                <ul className="grid grid-cols-1 gap-3">
                    {bookmarks.map((bookmark) => (
                        <li
                            key={bookmark.id}
                            className="group relative border border-border bg-card hover:bg-muted/30 hover:border-muted-foreground/30 p-4 rounded-lg transition-all duration-200 flex items-start justify-between gap-4"
                        >
                            <div className="flex items-start gap-3 overflow-hidden">
                                <div className="mt-1 p-1.5 bg-secondary text-secondary-foreground rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="2" x2="22" y1="12" y2="12" />
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <a
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-semibold text-foreground hover:text-primary hover:underline transition-colors truncate block"
                                    >
                                        {bookmark.title}
                                    </a>
                                    <a
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-muted-foreground truncate hover:text-foreground/80 transition-colors block"
                                    >
                                        {bookmark.url}
                                    </a>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(bookmark.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all duration-200"
                                title="Delete"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" x2="6" y1="6" y2="18" />
                                    <line x1="6" x2="18" y1="6" y2="18" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
