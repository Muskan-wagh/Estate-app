import { createClient, isAdmin as checkAdmin } from '@/lib/supabase-server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Playfair_Display } from 'next/font/google';
import { Plus, Search, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import BlogSearch from '@/components/BlogSearch';

const playfair = Playfair_Display({ subsets: ['latin'] });

export const revalidate = 600; // Cache for 10 minutes

export default async function BlogsPage({ searchParams }) {
    const { location, category } = await searchParams;
    const supabase = await createClient();
    const isAdmin = await checkAdmin();

    // Build Query
    let query = supabase.from('blogs').select('*').order('created_at', { ascending: false });

    // Security: Public only sees published
    if (!isAdmin) {
        query = query.eq('status', 'published');
    }

    // Apply Filters
    if (location) {
        query = query.ilike('location', `%${location}%`);
    }
    if (category && category !== 'All Categories') {
        query = query.eq('property_type', category);
    }

    const { data: blogs, error } = await query;
    const blogList = blogs || [];

    return (
        <main className="min-h-screen bg-white text-black font-sans flex flex-col">
            <Navbar lightHeader={true} />

            <div className="flex-grow pt-24 max-w-5xl mx-auto px-6 w-full">
                <BlogSearch />

                <header className="flex justify-between items-end mb-16 px-4">
                    <h2 className="text-4xl font-black tracking-tighter uppercase">Premium Selection</h2>
                    <div className="flex items-center gap-6">
                        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                            Refine by {blogList.length} unique entries
                        </p>
                        {isAdmin && (
                            <Link href="/admin/blogs/add" className="p-4 bg-black text-white rounded-full hover:bg-zinc-800 transition-all shadow-xl active:scale-90">
                                <Plus size={20} />
                            </Link>
                        )}
                    </div>
                </header>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 pb-40">
                    {blogList.length > 0 ? blogList.map((blog) => (
                        <Link key={blog.id} href={`/blogs/${blog.id}`} className="group cursor-pointer relative block">
                            {blog.status === 'draft' && (
                                <div className="absolute top-6 left-6 z-10 bg-black text-white text-[9px] font-black px-4 py-2 rounded-full tracking-widest uppercase shadow-2xl">Draft</div>
                            )}

                            <div className="aspect-[4/3] bg-zinc-50 rounded-[2rem] overflow-hidden mb-8 border border-zinc-100 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                                {blog.image_url ? (
                                    <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-zinc-200">NO VIEW</div>
                                )}
                            </div>

                            <div className="space-y-4 px-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{new Date(blog.created_at).toLocaleDateString('en-GB')}</p>
                                    <span className="text-[8px] font-black px-3 py-1 bg-black text-white rounded-full uppercase tracking-widest">{blog.property_type || 'General'}</span>
                                </div>
                                <h3 className={`text-2xl font-bold leading-tight group-hover:translate-x-2 transition-transform ${playfair.className}`}>
                                    {blog.title}
                                </h3>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                    <Search size={10} /> {blog.location || 'Unknown Site'}
                                </p>
                            </div>
                        </Link>
                    )) : (
                        <div className="col-span-full py-40 flex flex-col items-center justify-center gap-8 text-center bg-zinc-50 rounded-[3rem] border border-dashed border-zinc-200">
                            <p className="text-xl font-black text-zinc-300 uppercase tracking-[0.2em]">No matches found</p>
                            <Link href="/blogs" className="flex items-center gap-3 px-8 py-4 bg-white border border-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-black transition-all shadow-sm">
                                <RotateCcw size={14} /> Reset all filters
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
