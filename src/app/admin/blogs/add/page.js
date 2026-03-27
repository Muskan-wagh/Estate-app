'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function AddBlog() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = '';
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `blogs/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('properties') // I'll use the same bucket or 'blogs' if it exists. 
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('properties')
                    .getPublicUrl(filePath);

                imageUrl = publicUrl;
            }

            const { error } = await supabase
                .from('blogs')
                .insert([
                    {
                        title: formData.title,
                        content: formData.content,
                        image_url: imageUrl,
                    }
                ]);

            if (error) throw error;

            alert('Article published successfully!');
            router.push('/blog');

        } catch (error) {
            console.error(error);
            alert('Error publishing article: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-zinc-950 text-white pb-32">
            <Navbar />

            <section className="pt-40 max-w-4xl mx-auto px-6">
                <div className="space-y-6 mb-16 border-b border-zinc-900 pb-16 text-center md:text-left">
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Editorial <span className="text-zinc-500">Board</span></h1>
                    <p className="max-w-xl text-lg text-zinc-400 font-medium italic leading-relaxed mx-auto md:mx-0">
                        Share your architectural wisdom and market insights with the global community.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Headline</label>
                        <input name="title" onChange={handleChange} required className="w-full bg-zinc-950 border border-white/5 px-4 py-6 text-xl font-black italic focus:outline-none focus:border-emerald-500 transition-colors rounded-sm" placeholder="The Future of Urban Architecture" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Feature Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} required className="w-full bg-zinc-900 border border-white/5 px-4 py-4 text-sm rounded-sm file:mr-8 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:bg-zinc-800 file:text-white cursor-pointer" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Content</label>
                        <textarea name="content" onChange={handleChange} required rows="15" className="w-full bg-zinc-950 border border-white/5 px-6 py-6 text-lg leading-relaxed font-medium italic text-zinc-400 focus:outline-none focus:border-emerald-500 transition-colors rounded-sm resize-none" placeholder="Start writing your masterpiece..." />
                    </div>

                    <button disabled={loading} className={`w-full py-6 text-sm font-black uppercase tracking-widest rounded-sm transition-all shadow-2xl ${loading ? 'bg-zinc-800 text-zinc-500' : 'bg-white text-black hover:bg-zinc-200 hover:scale-[1.01] active:scale-100'}`}>
                        {loading ? 'Publishing Thoughts...' : 'Publish Article'}
                    </button>
                </form>
            </section>

            <Footer />
        </main>
    );
}
