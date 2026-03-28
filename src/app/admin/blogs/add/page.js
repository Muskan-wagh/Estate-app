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
    const [docFile, setDocFile] = useState(null); // Document State

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        property_type: 'Commercial',
        location: '',
        address: '',
        mpbhulekh_link: '',
        map_link: '', // Map link
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
            const { data: adminData } = await supabase.from('admins').select('id').eq('id', session.user.id).single();
            if (!adminData) router.push('/');
            else setIsAdmin(true);
        };
        checkAdmin();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = '';
            let docUrl = '';

            // Handle Photo Upload
            if (imageFile) {
                const fileName = `img-${Math.random()}.${imageFile.name.split('.').pop()}`;
                const { error: uploadError } = await supabase.storage.from('properties').upload(`blogs/${fileName}`, imageFile);
                if (uploadError) throw uploadError;
                imageUrl = supabase.storage.from('properties').getPublicUrl(`blogs/${fileName}`).data.publicUrl;
            }

            // Handle Document Upload
            if (docFile) {
                const docName = `doc-${Math.random()}.${docFile.name.split('.').pop()}`;
                const { error: docError } = await supabase.storage.from('properties').upload(`docs/${docName}`, docFile);
                if (docError) throw docError;
                docUrl = supabase.storage.from('properties').getPublicUrl(`docs/${docName}`).data.publicUrl;
            }

            const { error } = await supabase.from('blogs').insert([{
                ...formData,
                image_url: imageUrl,
                document_url: docUrl
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
        <main className="min-h-screen bg-white text-zinc-950 font-sans pb-24">
            <Navbar lightHeader={true} />
            <section className="pt-32 max-w-xl mx-auto px-6">
                <header className="mb-12">
                    <h1 className="text-4xl font-black mb-4 tracking-tighter">Publish Property</h1>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Headline</label>
                        <input name="title" onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full border-b border-zinc-100 py-3 text-lg font-bold focus:outline-none" placeholder="Residential Plot in Bhopal" />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Category</label>
                            <select name="property_type" onChange={(e) => setFormData({ ...formData, property_type: e.target.value })} className="w-full border-b border-zinc-100 py-3 text-sm font-bold bg-transparent focus:outline-none appearance-none">
                                <option>Commercial</option>
                                <option>Agriculture</option>
                                <option>Government</option>
                                <option>Plot</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Primary Photo</label>
                            <input type="file" required onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-[10px] text-zinc-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-zinc-50" />
                        </div>
                    </div>

                    {/* Property Assets Section */}
                    <div className="p-8 bg-zinc-50/50 rounded-2xl space-y-8 border border-zinc-100">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Property Assets</p>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 pl-1">Legal Document (PDF/DOC)</label>
                                <input type="file" onChange={(e) => setDocFile(e.target.files[0])} className="w-full text-[10px] text-zinc-400 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:bg-zinc-950 file:text-white cursor-pointer" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 pl-1">Map Iframe / Google Link</label>
                                <input name="map_link" onChange={(e) => setFormData({ ...formData, map_link: e.target.value })} className="w-full border-b border-zinc-200 py-3 text-[11px] font-bold focus:outline-none bg-transparent" placeholder="Paste Google Maps iframe or link" />
                            </div>
                        </div>
                    </div>

                    {/* Regional Info */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Location</label>
                            <input name="location" onChange={(e) => setFormData({ ...formData, location: e.target.value })} required className="w-full border-b border-zinc-100 py-3 text-sm font-bold bg-transparent focus:outline-none" placeholder="Indore" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">MPBhulekh Link</label>
                            <input name="mpbhulekh_link" onChange={(e) => setFormData({ ...formData, mpbhulekh_link: e.target.value })} className="w-full border-b border-zinc-100 py-3 text-sm font-bold bg-transparent focus:outline-none" placeholder="https://mpbhulekh..." />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Address</label>
                        <input name="address" onChange={(e) => setFormData({ ...formData, address: e.target.value })} required className="w-full border-b border-zinc-100 py-3 text-sm font-bold bg-transparent focus:outline-none" placeholder="123, Main Street, MG Road" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Status</label>
                        <div className="flex gap-4 pt-1">
                            {['published', 'draft'].map((s) => (
                                <button key={s} type="button" onClick={() => setFormData({ ...formData, status: s })} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${formData.status === s ? 'bg-zinc-950 text-white border-zinc-950 shadow-lg' : 'bg-transparent text-zinc-200 border-zinc-100'}`}>{s}</button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Content</label>
                        <textarea name="content" onChange={(e) => setFormData({ ...formData, content: e.target.value })} required rows="5" className="w-full border-b border-zinc-100 py-3 text-sm font-medium leading-relaxed bg-transparent focus:outline-none resize-none" placeholder="Essence of the property..." />
                    </div>

                    <button disabled={loading} className="w-full py-6 bg-zinc-950 text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all shadow-xl disabled:opacity-50 active:scale-95">
                        {loading ? 'Transmitting...' : 'Establish Blog'}
                    </button>
                </form>
            </section>
            <Footer />
        </main>
    );
}
