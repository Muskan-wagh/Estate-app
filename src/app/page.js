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

  const { data: properties, error } = await query;

  return (
    <main className="min-h-screen bg-white text-zinc-950 transition-colors duration-500 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen sm:h-[85vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-zinc-100 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Real Estate"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-[10] max-w-5xl mx-auto px-6 text-center space-y-8 md:space-y-12">
          <h1 className="text-5xl sm:text-7xl md:text-[100px] font-bold tracking-tighter leading-none uppercase font-outfit text-white drop-shadow-2xl">
            Find Your <span className="block">Workspace</span>
          </h1>
          <p className="max-w-xl mx-auto text-base sm:text-lg text-white font-medium leading-relaxed drop-shadow-lg opacity-90 px-4">
            Discover a curated collection of premium properties and architectural gems.
            The best place to find the perfect housing solution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-16 pb-8">
            <Link href="#listings" className="w-full sm:w-auto px-10 py-5 bg-white text-zinc-950 text-xs font-black uppercase tracking-[0.2em] rounded-sm hover:bg-zinc-100 transition-all shadow-2xl active:scale-95 text-center">
              Explore Now
            </Link>
            <Link href="/about" className="w-full sm:w-auto px-10 py-5 border border-white/40 text-white text-xs font-black uppercase tracking-[0.2em] rounded-sm hover:bg-white/10 transition-all active:scale-95 text-center">
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* About Description */}
      <section className="max-w-7xl mx-auto px-6 py-24 sm:py-32 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
        <div className="md:col-span-4 border-l-4 border-zinc-100 pl-6 md:pl-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">About the agency</span>
        </div>
        <div className="md:col-span-8 space-y-8 md:space-y-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-zinc-900 max-w-3xl">
            The best place to find the best housing in your city — we are the best in the market
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-zinc-500 text-sm sm:text-base leading-relaxed font-normal">
            <p>
              Whether you're looking for a cozy apartment in the city or a sprawling estate in the countryside, we're here to guide you every step of the way.
            </p>
            <p>
              We pride ourselves on our commitment to excellence and our personalized approach to client service. When you work with us, you can trust that we'll go above and beyond.
            </p>
          </div>
        </div>
      </section>


      <Footer />
    </main>
  );
}
