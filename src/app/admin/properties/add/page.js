'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function AddProperty() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [videoFile, setVideoFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        type: 'Apartment',
        area: '',
        bedrooms: '',
        bathrooms: '',
        status: 'available'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Insert property
            const { data: property, error: propertyError } = await supabase
                .from('properties')
                .insert([
                    {
                        title: formData.title,
                        description: formData.description,
                        price: parseFloat(formData.price),
                        location: formData.location,
                        type: formData.type,
                        area: parseFloat(formData.area),
                        bedrooms: parseInt(formData.bedrooms),
                        bathrooms: parseInt(formData.bathrooms),
                        status: formData.status,
                    }
                ])
                .select()
                .single();

            if (propertyError) throw propertyError;

            const propertyId = property.id;

            // 2. Upload images
            const imageUrls = [];
            for (const file of images) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${propertyId}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('properties')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('properties')
                    .getPublicUrl(filePath);

                imageUrls.push({ property_id: propertyId, image_url: publicUrl });
            }

            if (imageUrls.length > 0) {
                const { error: imagesError } = await supabase
                    .from('property_images')
                    .insert(imageUrls);
                if (imagesError) throw imagesError;
            }

            // 3. Handle video (File or URL)
            let finalVideoUrl = videoUrl;
            if (videoFile) {
                const fileExt = videoFile.name.split('.').pop();
                const fileName = `video-${Math.random()}.${fileExt}`;
                const filePath = `${propertyId}/${fileName}`;

                const { error: videoUploadError } = await supabase.storage
                    .from('properties')
                    .upload(filePath, videoFile);

                if (videoUploadError) throw videoUploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('properties')
                    .getPublicUrl(filePath);

                finalVideoUrl = publicUrl;
            }

            if (finalVideoUrl) {
                const { error: videoError } = await supabase
                    .from('property_videos')
                    .insert([{ property_id: propertyId, video_url: finalVideoUrl }]);
                if (videoError) throw videoError;
            }

            alert('Property added successfully!');
            router.push('/');

        } catch (error) {
            console.error(error);
            alert('Error adding property: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-zinc-950 text-white pb-32">
            <Navbar />

            <section className="pt-40 max-w-4xl mx-auto px-6">
                <div className="space-y-6 mb-16 border-b border-zinc-900 pb-16">
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">New <span className="text-zinc-500">Inventory</span></h1>
                    <p className="text-lg text-zinc-400 font-medium italic leading-relaxed">
                        Add technical precision and visual excellence to your new property.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Title</label>
                            <input name="title" onChange={handleChange} required className="w-full bg-zinc-950 border border-white/5 px-4 py-4 text-sm focus:outline-none focus:border-emerald-500 transition-colors rounded-sm" placeholder="Glass Haus Mansion" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Location</label>
                            <input name="location" onChange={handleChange} required className="w-full bg-zinc-950 border border-white/5 px-4 py-4 text-sm focus:outline-none focus:border-emerald-500 transition-colors rounded-sm" placeholder="Zurich, Switzerland" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Description</label>
                        <textarea name="description" onChange={handleChange} required rows="6" className="w-full bg-zinc-950 border border-white/5 px-4 py-4 text-sm focus:outline-none focus:border-emerald-500 transition-colors rounded-sm resize-none" placeholder="Elaborate on architecture, materials, and lifestyle..." />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-y border-zinc-900 py-12">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Price ($)</label>
                            <input type="number" name="price" onChange={handleChange} required className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors rounded-sm" placeholder="1200000" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Area (sqft)</label>
                            <input type="number" name="area" onChange={handleChange} required className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors rounded-sm" placeholder="4500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Beds</label>
                            <input type="number" name="bedrooms" onChange={handleChange} required className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors rounded-sm" placeholder="4" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Baths</label>
                            <input type="number" name="bathrooms" onChange={handleChange} required className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors rounded-sm" placeholder="3" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-12 border-b border-zinc-900">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Property Type</label>
                            <select name="type" onChange={handleChange} className="w-full bg-zinc-950 border border-white/5 px-4 py-4 text-sm focus:outline-none focus:border-emerald-500 transition-colors rounded-sm appearance-none">
                                <option value="Apartment">Apartment</option>
                                <option value="Villa">Villa</option>
                                <option value="Loft">Loft</option>
                                <option value="Studio">Studio</option>
                                <option value="Condo">Condo</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</label>
                            <select name="status" onChange={handleChange} className="w-full bg-zinc-950 border border-white/5 px-4 py-4 text-sm focus:outline-none focus:border-emerald-500 transition-colors rounded-sm appearance-none">
                                <option value="available">Available</option>
                                <option value="sold">Sold</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-xl font-black uppercase tracking-tight italic">Visual Assets</h3>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Image Gallery (Multiple)</label>
                            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full bg-zinc-900/50 border border-dashed border-white/10 px-8 py-12 text-sm focus:outline-none focus:border-emerald-500 transition-colors rounded-2xl file:mr-8 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:bg-emerald-500 file:text-white hover:file:bg-emerald-600 cursor-pointer" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Video File</label>
                                <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} className="w-full bg-zinc-900 border border-white/5 px-4 py-4 text-sm rounded-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">OR Video URL (YouTube/Vimeo)</label>
                                <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full bg-zinc-950 border border-white/5 px-4 py-4 text-sm focus:outline-none focus:border-emerald-500 transition-colors rounded-sm" placeholder="https://youtube.com/..." />
                            </div>
                        </div>
                    </div>

                    <button disabled={loading} className={`w-full py-6 text-sm font-black uppercase tracking-widest rounded-sm transition-all shadow-2xl ${loading ? 'bg-zinc-800 text-zinc-500' : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-[1.01] active:scale-100'}`}>
                        {loading ? 'Processing Transaction...' : 'Publish Property'}
                    </button>
                </form>
            </section>

            <Footer />
        </main>
    );
}
