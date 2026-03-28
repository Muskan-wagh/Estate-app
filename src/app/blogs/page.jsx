'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Playfair_Display } from 'next/font/google';

import { Plus } from 'lucide-react';
import Link from 'next/link';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchBlogsAndStatus = async () => {
            setLoading(true);

            // 1. Check if user is Admin
            const { data: { session } } = await supabase.auth.getSession();
            let adminStatus = false;
            if (session) {
                const { data: adminData } = await supabase
                    .from('admins')
                    .select('id')
                    .eq('id', session.user.id)
                    .single();
                if (adminData) adminStatus = true;
                setIsAdmin(adminStatus);
            }

            // 2. Fetch Blogs
            let query = supabase.from('blogs').select('*').order('created_at', { ascending: false });

            // If NOT admin, only show published
            if (!adminStatus) {
                query = query.eq('status', 'published');
            }

            const { data, error } = await query;
            if (!error && data) setBlogs(data);
            setLoading(false);
        };

        fetchBlogsAndStatus();
    }, []);

    if (loading) return null;

    return (
        <main className="min-h-screen bg-white text-zinc-950 font-sans flex flex-col">
            <Navbar lightHeader={true} />

            <div className="flex-grow pt-40 max-w-xl mx-auto px-6 w-full">
                <header className="flex justify-between items-end mb-24">
                    <h1 className="text-4xl font-black tracking-tighter">Blog</h1>
                    {isAdmin && (
                        <Link
                            href="/admin/blogs/add"
                            className="p-3 bg-zinc-50 border border-zinc-100 rounded-full hover:bg-zinc-950 hover:text-white transition-all shadow-sm active:scale-90"
                        >
                            <Plus size={20} />
                        </Link>
                    )}
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20 pb-40">
                    {blogs.length > 0 ? blogs.map((blog) => (
                        <article key={blog.id} className="group cursor-pointer relative">
                            {/* Draft Badge for Admins */}
                            {blog.status === 'draft' && (
                                <div className="absolute top-4 left-4 z-10 bg-black text-white text-[8px] font-black px-3 py-1 rounded-full tracking-widest uppercase">
                                    Draft
                                </div>
                            )}

                            <div className="aspect-square bg-zinc-50 rounded-lg overflow-hidden mb-6 border border-zinc-100 shadow-sm group-hover:shadow-xl transition-all duration-700">
                                {blog.image_url ? (
                                    <img
                                        src={blog.image_url}
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-zinc-300">No View</div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                                    {new Date(blog.created_at).toLocaleDateString('en-GB')}
                                </p>
                                <h3 className={`text-xl font-bold leading-tight group-hover:underline decoration-zinc-200 underline-offset-8 transition-all ${playfair.className}`}>
                                    {blog.title}
                                </h3>
                                <div className="pt-2 flex flex-wrap gap-2">
                                    <span className="text-[8px] font-black px-2 py-1 bg-zinc-50 border border-zinc-100 rounded-full uppercase tracking-widest text-zinc-400">
                                        {blog.property_type || 'General'}
                                    </span>
                                    <span className="text-[8px] font-black px-2 py-1 bg-zinc-50 border border-zinc-100 rounded-full uppercase tracking-widest text-zinc-400">
                                        {blog.location || 'Site'}
                                    </span>
                                </div>
                            </div>
                        </article>
                    )) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-sm font-bold text-zinc-200 uppercase tracking-widest">No entries found</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
