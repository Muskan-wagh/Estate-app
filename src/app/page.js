import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
  const { location, type } = await searchParams;

  let query = supabase
    .from('properties')
    .select('*, property_images(image_url)')
    .order('created_at', { ascending: false });

  if (location) query = query.ilike('location', `%${location}%`);
  if (type) query = query.eq('type', type);

  const { data: properties } = await query;

  return (
    <main className="min-h-screen bg-white text-zinc-950 transition-colors duration-500 overflow-x-hidden">
      <Navbar />

      {/* Hero Section - Optimized for Mobile */}
      <section className="relative h-screen sm:h-[85vh] flex flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 bg-zinc-100 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover scale-110 md:scale-100 origin-center"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10 mt-12 md:mt-0">
          <h1 className="text-4xl sm:text-7xl md:text-[100px] font-bold tracking-tighter leading-[0.9] uppercase text-white drop-shadow-2xl">
            Find Your <span className="block text-zinc-300">Workspace</span>
          </h1>

          <p className="max-w-md mx-auto text-sm sm:text-lg text-white font-medium leading-relaxed opacity-80 px-4">
            Curating premium architectural gems for the modern visionary.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
            <Link href="/blogs" className="w-48 sm:w-auto px-10 py-5 bg-white text-zinc-950 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-100 transition-all shadow-xl active:scale-95">
              Explore Now
            </Link>
            <Link href="/about" className="w-48 sm:w-auto px-10 py-5 border border-white/30 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white/10 transition-all active:scale-95">
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 sm:py-32 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-4 border-l-2 border-black pl-6 md:pl-8">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">Philosophy</span>
        </div>
        <div className="md:col-span-8 space-y-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-2xl">
            The standard in architectural excellence.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-zinc-500 text-sm leading-relaxed">
            <p>From city dwellings to rural estates, we provide a personalized approach to your housing search.</p>
            <p>Commitment to quality is our baseline. Every property is hand-selected for its unique value.</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
