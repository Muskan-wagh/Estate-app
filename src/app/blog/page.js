import { createClient, getSession } from '@/lib/supabase-server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    const supabase = await createClient();
    const { data: blogs, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <main className="min-h-screen bg-white text-zinc-950 transition-colors duration-500 pb-16">
            <Navbar lightHeader={true} />

            {/* Hero */}
            <section className="pt-48 pb-24 border-b border-zinc-100 bg-zinc-50 px-6">
                <div className="max-w-7xl mx-auto space-y-6 text-center md:text-left">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-none text-zinc-900 drop-shadow-sm">Magazine <span className="text-zinc-300 font-medium">& Culture</span></h1>
                    <p className="max-w-2xl text-lg text-zinc-500 font-medium leading-relaxed opacity-80">
                        Stay updated with the latest trends in real estate, architectural design, and modern living.
                    </p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                {error && (
                    <div className="py-20 text-center text-red-500 border border-red-50 p-12 bg-red-50/20 rounded-2xl">{error.message}</div>
                )}

                {blogs && blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                        {blogs.map((blog) => (
                            <Link key={blog.id} href={`/blog/${blog.id}`} className="group space-y-6 block pb-4 border-b border-zinc-50 hover:border-zinc-200 transition-colors">
                                <div className="aspect-[16/10] relative overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200 shadow-sm transition-shadow group-hover:shadow-2xl">
                                    <img
                                        src={blog.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop'}
                                        alt={blog.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100 grayscale hover:grayscale-0"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-500/10 bg-emerald-50/10 px-2 py-0.5 rounded-sm">Estate News</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">{new Date(blog.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold uppercase tracking-tight group-hover:text-emerald-600 transition-colors leading-tight text-zinc-900 decoration-zinc-100 group-hover:decoration-emerald-500/30 underline underline-offset-8 decoration-2">{blog.title}</h2>
                                    <p className="text-sm text-zinc-500 font-medium leading-relaxed line-clamp-3">
                                        {blog.content.replace(/<[^>]*>?/gm, '').substring(0, 160)}...
                                    </p>
                                    <div className="pt-4 flex items-center gap-2 group/btn">
                                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform text-zinc-900 group-hover:text-emerald-600">Explore Article</span>
                                        <div className="h-px bg-zinc-100 flex-grow group-hover:bg-emerald-500 transition-colors"></div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : !error && (
                    <div className="py-40 text-center space-y-4">
                        <p className="text-zinc-300 font-black uppercase tracking-widest">No entries found</p>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
