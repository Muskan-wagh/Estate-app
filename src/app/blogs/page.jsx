'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Playfair_Display } from 'next/font/google';
import { Plus, Search, RotateCcw } from 'lucide-react';
import Link from 'next/link';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Search States
    const [locationInput, setLocationInput] = useState('');
    const [categoryInput, setCategoryInput] = useState('All Categories');

    const fetchBlogs = async (location = '', category = 'All Categories') => {
        setLoading(true);

        // 1. Check Admin Status
        const { data: { session } } = await supabase.auth.getSession();
        let adminStatus = false;
        if (session) {
            const { data } = await supabase.from('admins').select('id').eq('id', session.user.id).single();
            if (data) adminStatus = true;
            setIsAdmin(adminStatus);
        }

        // 2. Build Query
        let query = supabase.from('blogs').select('*').order('created_at', { ascending: false });

        // Security: Public only sees published
        if (!adminStatus) {
            query = query.eq('status', 'published');
        }

        // Apply Filters
        if (location) {
            query = query.ilike('location', `%${location}%`);
        }
        if (category !== 'All Categories') {
            query = query.eq('property_type', category);
        }

        const { data, error } = await query;
        if (!error) setBlogs(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBlogs(locationInput, categoryInput);
    };

    const handleReset = () => {
        setLocationInput('');
        setCategoryInput('All Categories');
        fetchBlogs('', 'All Categories');
    };

    return (
        <main className="min-h-screen bg-white text-black font-sans flex flex-col">
            <Navbar lightHeader={true} />

            <div className="flex-grow pt-40 max-w-5xl mx-auto px-6 w-full">
                {/* Search Bar Implementation */}
                <div className="mb-20 bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100 shadow-sm transition-all hover:shadow-md">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-4">Target Location</label>
                            <input
                                type="text"
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                placeholder="Indore, Bhopal, etc..."
                                className="w-full bg-white border border-zinc-200 py-4 px-6 rounded-2xl text-xs font-bold focus:outline-none focus:border-black transition-all"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-4">Property Type</label>
                            <select
                                value={categoryInput}
                                onChange={(e) => setCategoryInput(e.target.value)}
                                className="w-full bg-white border border-zinc-200 py-4 px-6 rounded-2xl text-xs font-bold focus:outline-none focus:border-black appearance-none"
                            >
                                <option>All Categories</option>
                                <option>Commercial</option>
                                <option>Agriculture</option>
                                <option>Government</option>
                                <option>Plot</option>
                            </select>
                        </div>
                        <button type="submit" className="bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-lg active:scale-95">
                            Refresh Search
                        </button>
                    </form>
                </div>

                <header className="flex justify-between items-end mb-16 px-4">
                    <h2 className="text-4xl font-black tracking-tighter uppercase">Premium Selection</h2>
                    <div className="flex items-center gap-6">
                        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                            Refine by {blogs.length} unique entries
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
                    {loading ? (
                        <div className="col-span-full py-20 text-center animate-pulse text-[10px] font-black uppercase tracking-widest">Searching Archives...</div>
                    ) : blogs.length > 0 ? blogs.map((blog) => (
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
                            <button onClick={handleReset} className="flex items-center gap-3 px-8 py-4 bg-white border border-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-black transition-all shadow-sm">
                                <RotateCcw size={14} /> Reset all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}

