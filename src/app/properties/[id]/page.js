import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PropertyDetail({ params }) {
    const { id } = await params;

    const { data: property, error } = await supabase
        .from('properties')
        .select('*, property_images(*), property_videos(*)')
        .eq('id', id)
        .single();

    if (!property) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-black uppercase tracking-widest italic mb-6">Oops!</h1>
                <p className="text-zinc-500 max-w-sm mb-12 uppercase text-xs font-bold leading-relaxed tracking-widest">
                    The property you're looking for might have been sold or removed.
                </p>
                <Link href="/" className="px-8 py-3 bg-white text-black text-sm font-black uppercase tracking-widest rounded-sm hover:bg-zinc-200 transition-colors shadow-2xl">
                    Back to Listings
                </Link>
            </main>
        );
    }

    const { title, description, price, location, type, area, bedrooms, bathrooms, status, property_images, property_videos } = property;

    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500 selection:text-white pb-16">
            <Navbar />

            {/* Header Container */}
            <div className="pt-32 max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-zinc-900 pb-16">
                    <div className="space-y-6 max-w-2xl">
                        <div className="flex gap-4">
                            <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm ${status === 'sold' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                {status || 'available'}
                            </span>
                            <span className="px-2 py-1 text-[10px] font-black uppercase tracking-widest bg-zinc-800 text-zinc-100 rounded-sm">
                                {type}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">{title}</h1>
                        <p className="text-lg text-zinc-400 font-medium leading-relaxed italic">{location}</p>
                    </div>
                    <div className="pt-4 text-right">
                        <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] block mb-2">Price</span>
                        <span className="text-5xl font-black text-emerald-400 tracking-tight leading-none italic">${price.toLocaleString()}</span>
                    </div>
                </div>

                {/* Gallery */}
                <section className="mt-16">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[600px]">
                        <div className="md:col-span-8 relative overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl group border border-white/5">
                            <img
                                src={property_images?.[0]?.image_url || 'https://via.placeholder.com/1200x800'}
                                alt={title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="md:col-span-4 grid grid-rows-2 gap-6">
                            <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 shadow-xl group">
                                <img
                                    src={property_images?.[1]?.image_url || property_images?.[0]?.image_url || 'https://via.placeholder.com/600x400'}
                                    alt={title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 shadow-xl group">
                                <img
                                    src={property_images?.[2]?.image_url || property_images?.[0]?.image_url || 'https://via.placeholder.com/600x400'}
                                    alt={title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Detailed Image Feed */}
                    {property_images && property_images.length > 3 && (
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                            {property_images.slice(3).map((img, i) => (
                                <div key={i} className="aspect-square relative overflow-hidden rounded-xl bg-zinc-900 border border-white/5 group">
                                    <img src={img.image_url} alt={`${title} ${i}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Info & Description */}
                <section className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-24">
                    <div className="lg:col-span-7 space-y-16">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-y border-zinc-900 py-12">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Area</p>
                                <p className="text-xl font-black italic">{area} <span className="text-xs uppercase text-zinc-600 not-italic">sqft</span></p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Beds</p>
                                <p className="text-xl font-black italic">{bedrooms}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Baths</p>
                                <p className="text-xl font-black italic">{bathrooms}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</p>
                                <p className="text-xl font-black italic text-emerald-400 capitalize">{status || 'Available'}</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-3xl font-black uppercase tracking-tight italic">Description</h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-zinc-400 leading-relaxed text-lg whitespace-pre-line font-medium italic">
                                    {description}
                                </p>
                            </div>
                        </div>

                        {/* Video Section */}
                        {property_videos && property_videos.length > 0 && (
                            <div className="space-y-8 pt-12 border-t border-zinc-900">
                                <h2 className="text-3xl font-black uppercase tracking-tight italic">Virtual Tour</h2>
                                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl flex items-center justify-center relative group">
                                    {property_videos[0].video_url.includes('youtube.com') || property_videos[0].video_url.includes('youtu.be') ? (
                                        <iframe
                                            className="w-full h-full"
                                            src={property_videos[0].video_url.replace('watch?v=', 'embed/')}
                                            title="Property Video"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <video
                                            controls
                                            className="w-full h-full object-cover"
                                        >
                                            <source src={property_videos[0].video_url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="lg:col-span-5 h-fit sticky top-32">
                        <div className="bg-zinc-900 p-10 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] space-y-8 backdrop-blur-md">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black uppercase tracking-tight italic">Interested?</h3>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                                    Fill the form below and our exclusive partner will reach out to you within 24 hours.
                                </p>
                            </div>
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">FullName</label>
                                    <input className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors rounded-sm" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">EmailAddress</label>
                                    <input className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors rounded-sm" placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Message</label>
                                    <textarea rows="4" className="w-full bg-zinc-950 border border-white/5 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors rounded-sm resize-none" placeholder="I'm interested in this property..." />
                                </div>
                                <button type="button" className="w-full bg-white text-black py-4 text-xs font-black uppercase tracking-widest rounded-sm hover:bg-zinc-200 transition-all shadow-xl active:scale-[0.98]">
                                    Send Inquiry
                                </button>
                            </form>
                        </div>
                    </aside>
                </section>
            </div>

            <Footer />
        </main>
    );
}
