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
    <main className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500 selection:text-white pb-16">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900 border-b border-white/5 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Real Estate"
            className="w-full h-full object-cover opacity-50 transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-zinc-950 to-transparent"></div>
        </div>

        <div className="relative z-[10] max-w-5xl mx-auto px-6 text-center space-y-12">
          <h1 className="text-7xl md:text-[120px] font-bold tracking-tighter leading-tight uppercase font-outfit text-white drop-shadow-[0_2px_40px_rgba(0,0,0,0.5)]">
            Find Your Workspace
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-zinc-100 font-medium leading-relaxed drop-shadow-lg opacity-80 backdrop-blur-sm px-4">
            Discover a curated collection of premium properties and architectural gems.
            The best place to find the perfect housing solution.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-16 pb-8">
            <Link href="#listings" className="px-10 py-4 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-sm hover:bg-zinc-200 transition-all shadow-2xl active:scale-95">
              Explore Now
            </Link>
            <Link href="/about" className="px-10 py-4 border border-white/40 text-white text-xs font-black uppercase tracking-[0.2em] rounded-sm hover:bg-white/10 transition-all active:scale-95">
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section id="listings" className="max-w-7xl mx-auto px-6 -mt-12 relative z-[10]">
        <div className="bg-zinc-900 p-8 border border-white/5 rounded-2xl shadow-2xl backdrop-blur-xl">
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Location</label>
              <input
                name="location"
                placeholder="Where to?"
                defaultValue={location}
                className="w-full bg-zinc-950 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 rounded-lg transition-colors"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Type</label>
              <select
                name="type"
                defaultValue={type}
                className="w-full bg-zinc-950 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 rounded-lg appearance-none transition-colors"
              >
                <option value="">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Loft">Loft</option>
                <option value="Studio">Studio</option>
                <option value="Condo">Condo</option>
              </select>
            </div>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold uppercase tracking-widest py-3 rounded-lg transition-colors shadow-lg shadow-emerald-500/20">
              Update List
            </button>
          </form>
        </div>
      </section>

      {/* Main Listings */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-zinc-900 pb-8">
          <h2 className="text-4xl font-bold tracking-tighter uppercase italic">Featured <span className="text-zinc-500">Listings</span></h2>
          <p className="text-sm font-medium text-zinc-500 tracking-wider uppercase mb-1">
            Found {properties?.length || 0} unique items
          </p>
        </div>

        {error && (
          <div className="py-20 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-red-400">Error loading data</p>
            <p className="text-zinc-500 mt-2">{error.message}</p>
          </div>
        )}

        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-12">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : !error && (
          <div className="py-40 text-center space-y-4">
            <div className="mx-auto w-12 h-12 border border-zinc-800 flex items-center justify-center rounded-full mb-4">
              <span className="text-zinc-700 font-bold uppercase tracking-widest">!</span>
            </div>
            <h3 className="text-xl font-medium text-zinc-400 uppercase tracking-widest">No properties found</h3>
            <p className="text-sm text-zinc-600">Try adjusting your filters or search terms.</p>
            <Link href="/" className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-widest hover:underline underline-offset-8 mt-12 transition-all">Reset Filters</Link>
          </div>
        )}
      </section>

      <div className="mt-40 bg-zinc-900/40 py-24 px-6 border-y border-zinc-900">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-black uppercase tracking-tight italic">Why rad apartments?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
            <div className="space-y-2">
              <span className="text-emerald-400 text-sm font-black italic">01.</span>
              <h4 className="text-xs font-bold uppercase tracking-widest">Curated List</h4>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">Each property is handpicked for its quality and architecture.</p>
            </div>
            <div className="space-y-2">
              <span className="text-emerald-400 text-sm font-black italic">02.</span>
              <h4 className="text-xs font-bold uppercase tracking-widest">Direct Contact</h4>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">No middlemen involved. Deal directly with owners or exclusive agents.</p>
            </div>
            <div className="space-y-2">
              <span className="text-emerald-400 text-sm font-black italic">03.</span>
              <h4 className="text-xs font-bold uppercase tracking-widest">Global Reach</h4>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">Our platform covers premium locations in 45 countries.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
