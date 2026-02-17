'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function AddBookmark() {
    const supabase = createClient()
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !url) return

        setLoading(true)
        const { error } = await supabase.from('bookmarks').insert({ title, url })

        if (error) {
            console.error('Error adding bookmark:', error)
            alert('Error adding bookmark')
        } else {
            setTitle('')
            setUrl('')
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="border border-border bg-card rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    Add Bookmark
                </h3>
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input-clean bg-muted/30 focus:bg-background h-10"
                        placeholder="e.g. Design Resources"
                        required
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">URL</label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="input-clean bg-muted/30 focus:bg-background h-10"
                        placeholder="https://..."
                        required
                    />
                </div>
                <div className="pt-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full sm:w-auto"
                    >
                        {loading ? 'Adding...' : 'Save Bookmark'}
                    </button>
                </div>
            </div>
        </form>
    )
}
