import { createClient } from '@/utils/supabase/server'
import AuthButton from '@/components/AuthButton'
import AddBookmark from '@/components/AddBookmark'
import BookmarkList from '@/components/BookmarkList'

export default async function Home() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    let bookmarks: any[] = []
    if (user) {
        const { data } = await supabase
            .from('bookmarks')
            .select('*')
            .order('created_at', { ascending: false })
        bookmarks = data ?? []
    }

    return (
        <main className="min-h-screen">
            <div className="container-wrapper">
                <header className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg transform rotate-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Smart Bookmark
                        </h1>
                    </div>
                    <AuthButton user={user} />
                </header>

                {user ? (
                    <div className="flex flex-col gap-10">
                        <section className="bg-card/50 backdrop-blur-sm">
                            <AddBookmark />
                        </section>

                        <div className="w-full h-px bg-border my-2"></div>

                        <section>
                            <BookmarkList initialBookmarks={bookmarks} />
                        </section>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">Welcome to Smart Bookmark</h2>
                        <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
                            A minimal, distraction-free way to save your essential links. Login to get started.
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}
