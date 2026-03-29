import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import InquiryForm from './InquiryForm';

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
            <main className="min-h-screen bg-white text-zinc-950 flex flex-col items-center justify-center p-6 text-center transition-colors">
                <Navbar lightHeader={true} />
                <h1 className="text-4xl font-bold uppercase tracking-tighter mb-4">Error 404</h1>
                <p className="text-zinc-500 max-w-sm mb-12 uppercase text-[10px] font-black leading-relaxed tracking-widest">
                    The property you're looking for might have been sold or removed from our archive.
                </p>
                <Link href="/" className="px-10 py-4 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-zinc-800 transition-all shadow-xl">
                    Back to Listings
                </Link>
            </main>
        );
    }

    const { title, description, price, location, type, area, bedrooms, bathrooms, status, property_images, property_videos } = property;

    return (
        <main className="min-h-screen bg-white text-zinc-950 selection:bg-emerald-500 selection:text-white pb-16 font-outfit">
            <Navbar lightHeader={true} />

            {/* Header Container */}
            <div className="pt-20 md:pt-32 max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-16 border-b border-zinc-100 pb-12 sm:pb-16">
                    <div className="space-y-6 max-w-3xl">
                        <div className="flex gap-4">
                            <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm ${status === 'sold' ? 'bg-zinc-950 text-white' : 'bg-emerald-500 text-white'}`}>
                                {status || 'available'}
                            </span>
                            <span className="px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-500 rounded-sm">
                                {type}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase leading-tight text-zinc-900">{title}</h1>
                        <p className="text-base sm:text-lg text-zinc-400 font-medium leading-relaxed opacity-80">{location}</p>
                    </div>
                    <div className="pt-4 text-left md:text-right w-full md:w-auto">
                        <span className="text-zinc-300 text-[10px] uppercase font-bold tracking-[0.2em] block mb-2">Price Estimate</span>
                        <span className="text-4xl sm:text-5xl font-bold text-zinc-950 tracking-tight leading-none">${price.toLocaleString()}</span>
                    </div>
                </div>

                {/* Gallery */}
                <section className="mt-12 sm:mt-16">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 h-auto md:h-[600px]">
                        <div className="md:col-span-8 aspect-video md:aspect-auto relative overflow-hidden rounded-2xl bg-zinc-50 shadow-lg group border border-zinc-100">
                            <img
                                src={property_images?.[0]?.image_url || 'https://via.placeholder.com/1200x800'}
                                alt={title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                        </div>
                        <div className="hidden md:grid md:col-span-4 grid-rows-2 gap-6">
                            <div className="relative overflow-hidden rounded-2xl bg-zinc-50 border border-zinc-100 shadow-sm group">
                                <img
                                    src={property_images?.[1]?.image_url || property_images?.[0]?.image_url || 'https://via.placeholder.com/600x400'}
                                    alt={title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                            <div className="relative overflow-hidden rounded-2xl bg-zinc-50 border border-zinc-100 shadow-sm group">
                                <img
                                    src={property_images?.[2]?.image_url || property_images?.[0]?.image_url || 'https://via.placeholder.com/600x400'}
                                    alt={title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Info & Description */}
                <section className="mt-16 sm:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-24">
                    <div className="lg:col-span-7 space-y-12 sm:y-16">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-zinc-100 py-10 sm:py-12">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Area</p>
                                <p className="text-xl font-bold text-zinc-900">{area} <span className="text-[10px] uppercase text-zinc-300 font-black">sqft</span></p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Sleeps</p>
                                <p className="text-xl font-bold text-zinc-900">{bedrooms} <span className="text-[10px] uppercase text-zinc-300 font-black">beds</span></p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Bathrooms</p>
                                <p className="text-xl font-bold text-zinc-900">{bathrooms} <span className="text-[10px] uppercase text-zinc-300 font-black">baths</span></p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Ownership</p>
                                <p className="text-xl font-bold text-emerald-600 capitalize">{status || 'Available'}</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold uppercase tracking-tight text-zinc-900 underline underline-offset-8 decoration-zinc-100 decoration-2">Overview</h2>
                            <div className="max-w-none">
                                <p className="text-zinc-500 leading-relaxed text-base sm:text-lg whitespace-pre-line font-medium opacity-90">
                                    {description}
                                </p>
                            </div>
                        </div>

                        {/* Video Section */}
                        {property_videos && property_videos.length > 0 && (
                            <div className="space-y-8 pt-12 border-t border-zinc-100">
                                <h2 className="text-2xl font-bold uppercase tracking-tight text-zinc-900">Virtual Walkthrough</h2>
                                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 shadow-2xl relative group">
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
                        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-zinc-200 shadow-2xl space-y-10">
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold uppercase tracking-tight text-zinc-900">Secure Inquiry</h3>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
                                    Fill the form below and an agent will contact you shortly.
                                </p>
                            </div>
                            <InquiryForm propertyId={id} propertyTitle={title} />
                        </div>
                    </aside>
                </section>
            </div>

            <Footer />
        </main>
    );
}
