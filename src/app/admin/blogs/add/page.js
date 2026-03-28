'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function AddBlog() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        property_type: 'Commercial',
        location: '',
        address: '',
        mpbhulekh_link: '',
        status: 'published'
    });

    // Admin Check
    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            const { data: adminData } = await supabase
                .from('admins')
                .select('id')
                .eq('id', session.user.id)
                .single();
            if (!adminData) router.push('/');
            else setIsAdmin(true);
        };
        checkAdmin();
    }, [router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = '';
            if (imageFile) {
                const fileName = `${Math.random()}.${imageFile.name.split('.').pop()}`;
                const filePath = `blogs/${fileName}`;
                const { error: uploadError } = await supabase.storage.from('properties').upload(filePath, imageFile);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from('properties').getPublicUrl(filePath);
                imageUrl = publicUrl;
            }

            const { error } = await supabase.from('blogs').insert([{
                ...formData,
                image_url: imageUrl,
            }]);

            if (error) throw error;
            alert('Article published successfully!');
            router.push('/blogs');
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) return null;

    return (
        <main className="min-h-screen bg-white text-zinc-950 font-sans pb-32">
            <Navbar lightHeader={true} />
            <section className="pt-40 max-w-xl mx-auto px-6">
                <header className="mb-16">
                    <h1 className="text-4xl font-black mb-4 tracking-tighter">New Editorial</h1>
                    <p className="text-xs font-black text-zinc-300 uppercase tracking-widest leading-loose max-w-xs">
                        Publish detailed property insights and architectural wisdom.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Headline</label>
                        <input name="title" onChange={handleChange} required className="w-full border-b border-zinc-200 py-3 text-lg font-bold focus:outline-none focus:border-zinc-950 bg-transparent transition-all" placeholder="Architecture Trends from Belgium" />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Property Category</label>
                            <select name="property_type" onChange={handleChange} className="w-full border-b border-zinc-200 py-3 text-sm font-bold bg-transparent focus:outline-none focus:border-zinc-950 appearance-none">
                                <option value="Commercial">Commercial</option>
                                <option value="Agriculture">Agriculture</option>
                                <option value="Government">Government</option>
                                <option value="Plot">Plot</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Visual Asset</label>
                            <input type="file" required onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-[10px] text-zinc-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-zinc-100 file:text-[10px] file:font-black file:uppercase" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Location</label>
                            <input name="location" onChange={handleChange} required className="w-full border-b border-zinc-200 py-3 text-sm font-bold bg-transparent focus:outline-none" placeholder="Indore, MP" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">MPBhulekh Link</label>
                            <input name="mpbhulekh_link" onChange={handleChange} className="w-full border-b border-zinc-200 py-3 text-sm font-bold bg-transparent focus:outline-none" placeholder="https://mpbhulekh.gov.in/..." />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Exact Address</label>
                        <input name="address" onChange={handleChange} required className="w-full border-b border-zinc-200 py-3 text-sm font-bold bg-transparent focus:outline-none" placeholder="Scheme No. 140, AB Road" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Publication Status</label>
                        <div className="flex gap-4 pt-2">
                            {['published', 'draft'].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: s })}
                                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${formData.status === s
                                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-lg'
                                        : 'bg-transparent text-zinc-300 border-zinc-100 hover:border-zinc-300'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Content</label>
                        <textarea name="content" onChange={handleChange} required rows="8" className="w-full border-b border-zinc-200 py-3 text-sm font-medium leading-relaxed bg-transparent focus:outline-none resize-none" placeholder="Narrate the architectural essence..." />
                    </div>

                    <button disabled={loading} className="w-full py-6 bg-zinc-950 text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all shadow-xl disabled:opacity-50">
                        {loading ? 'Transmitting Editorial...' : 'Publish Blog'}
                    </button>
                </form>
            </section>
            <Footer />
        </main>
    );
}
