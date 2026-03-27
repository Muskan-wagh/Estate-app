import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BlogDetail({ params }) {
    const { id } = await params;

    const { data: blog, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

    if (!blog) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-black uppercase tracking-widest italic mb-6">Article not found</h1>
                <Link href="/blog" className="px-8 py-3 bg-white text-black text-sm font-black uppercase tracking-widest rounded-sm hover:bg-zinc-200 transition-colors">
                    Back to Stories
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500 pb-16">
            <Navbar />

            {/* Article Header */}
            <article className="pt-32 max-w-4xl mx-auto px-6 space-y-12">
                <div className="space-y-6">
                    <div className="flex gap-4 items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-sm">Estate News</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{new Date(blog.created_at).toLocaleDateString()}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-tight">{blog.title}</h1>
                </div>

                <div className="aspect-[21/9] relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 shadow-2xl">
                    <img
                        src={blog.image_url || 'https://via.placeholder.com/1200x500'}
                        alt={blog.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                </div>

                <div className="prose prose-invert max-w-none pt-8 border-t border-zinc-900 leading-relaxed font-medium italic text-zinc-400 space-y-6">
                    {blog.content.split('\n').map((line, i) => (
                        <p key={i} className="text-lg md:text-xl leading-relaxed">{line}</p>
                    ))}
                </div>

                <div className="pt-24 border-t border-zinc-900">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
                        <div className="space-y-2">
                            <h3 className="text-xl font-black uppercase tracking-tight italic">Share this story</h3>
                            <div className="flex gap-6 mt-4 justify-center md:justify-start">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-white transition-colors underline underline-offset-4">Twitter</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-white transition-colors underline underline-offset-4">LinkedIn</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-white transition-colors underline underline-offset-4">Facebook</span>
                            </div>
                        </div>
                        <Link href="/blog" className="px-8 py-3 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-zinc-800 transition-colors border border-white/5 shadow-xl">
                            Back to Stories
                        </Link>
                    </div>
                </div>
            </article>

            <Footer />
        </main>
    );
}
