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

      {/* Filter Section */}
      <section id="listings" className="max-w-7xl mx-auto px-6 relative z-[10] -mt-12 sm:mt-0">
        <div className="bg-white p-6 sm:p-10 border border-zinc-100 rounded-2xl shadow-2xl backdrop-blur-xl">
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-end">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Target Location</label>
              <input
                name="location"
                placeholder="Enter city or area"
                defaultValue={location}
                className="w-full bg-zinc-50 border border-zinc-200 px-5 py-4 text-sm focus:outline-none focus:border-zinc-950 rounded-sm transition-colors text-zinc-900 placeholder:text-zinc-400 font-medium"
                autoComplete="off"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Property Type</label>
              <select
                name="type"
                defaultValue={type}
                className="w-full bg-zinc-50 border border-zinc-200 px-5 py-4 text-sm focus:outline-none focus:border-zinc-950 rounded-sm appearance-none transition-colors text-zinc-900 font-medium"
              >
                <option value="">All Categories</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Loft">Loft</option>
                <option value="Studio">Studio</option>
                <option value="Condo">Condo</option>
              </select>
            </div>
            <button className="bg-zinc-950 hover:bg-zinc-800 text-white text-[11px] font-black uppercase tracking-widest py-4 sm:py-5 rounded-sm transition-all shadow-lg active:scale-95 outline-none">
              Refresh Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Listings */}
      <section className="max-w-7xl mx-auto px-6 mt-20 sm:mt-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 border-b border-zinc-100 pb-8 sm:pb-10 space-y-4 md:space-y-0 text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter uppercase text-zinc-900 underline decoration-zinc-100 underline-offset-10">Premium <span className="text-zinc-400 font-medium">Selection</span></h2>
          <p className="text-[10px] font-black text-zinc-400 tracking-[0.2em] uppercase mb-1">
            Refine by {properties?.length || 0} unique entries
          </p>
        </div>

        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-16">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="py-24 sm:py-40 text-center space-y-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-zinc-200 uppercase tracking-tighter">No matches found</h3>
            <Link href="/" className="inline-block px-8 py-3 bg-zinc-100 text-[10px] font-black text-zinc-900 uppercase tracking-widest rounded-sm hover:bg-zinc-200 transition-all">Reset All Filters</Link>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
