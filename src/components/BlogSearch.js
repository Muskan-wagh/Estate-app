'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RotateCcw } from 'lucide-react';

export default function BlogSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [locationInput, setLocationInput] = useState(searchParams.get('location') || '');
    const [categoryInput, setCategoryInput] = useState(searchParams.get('category') || 'All Categories');

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (locationInput) params.set('location', locationInput);
        if (categoryInput !== 'All Categories') params.set('category', categoryInput);
        router.push(`/blogs?${params.toString()}`);
    };

    const handleReset = () => {
        setLocationInput('');
        setCategoryInput('All Categories');
        router.push('/blogs');
    };

    return (
        <div className="mb-12 bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100 shadow-sm transition-all hover:shadow-md">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-4">Target Location</label>
                    <input
                        type="text"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        placeholder="Indore, Bhopal, etc..."
                        className="w-full bg-white border border-zinc-200 py-4 px-6 rounded-2xl text-xs font-bold focus:outline-none focus:border-black transition-all"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-4">Property Type</label>
                    <select
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        className="w-full bg-white border border-zinc-200 py-4 px-6 rounded-2xl text-xs font-bold focus:outline-none focus:border-black appearance-none"
                    >
                        <option>All Categories</option>
                        <option>Commercial</option>
                        <option>Agriculture</option>
                        <option>Government</option>
                        <option>Plot</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="flex-grow bg-black text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-lg active:scale-95">
                        Refresh Search
                    </button>
                    {(locationInput || categoryInput !== 'All Categories') && (
                        <button type="button" onClick={handleReset} className="p-4 bg-white border border-zinc-200 rounded-2xl hover:border-black transition-all">
                            <RotateCcw size={18} />
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
