import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    const { data: blogs, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500 pb-16">
            <Navbar />

            {/* Hero */}
            <section className="pt-40 pb-24 border-b border-zinc-900 bg-zinc-950 px-6">
                <div className="max-w-7xl mx-auto space-y-8">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">Insights <span className="text-zinc-500">& Articles</span></h1>
                    <p className="max-w-2xl text-lg text-zinc-400 font-medium italic leading-relaxed">
                        Stay updated with the latest trends in real estate, architectural design, and modern living.
                    </p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                {error && (
                    <div className="py-20 text-center text-red-500">{error.message}</div>
                )}

                {blogs && blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                        {blogs.map((blog) => (
                            <Link key={blog.id} href={`/blog/${blog.id}`} className="group space-y-6 block">
                                <div className="aspect-[16/10] relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 shadow-xl group">
                                    <img
                                        src={blog.image_url || 'https://via.placeholder.com/800x500'}
                                        alt={blog.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-sm">Estate News</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{new Date(blog.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight italic group-hover:text-emerald-400 transition-colors leading-tight">{blog.title}</h2>
                                    <p className="text-sm text-zinc-500 font-medium leading-relaxed italic line-clamp-3">
                                        {blog.content.replace(/<[^>]*>?/gm, '').substring(0, 160)}...
                                    </p>
                                    <div className="pt-4 flex items-center gap-2 group/btn">
                                        <span className="text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">Read Article</span>
                                        <span className="h-px bg-zinc-800 flex-grow group-hover:bg-emerald-500 transition-colors"></span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : !error && (
                    <div className="py-20 text-center space-y-4">
                        <p className="text-zinc-600 font-black uppercase tracking-widest italic">No stories available yet</p>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
