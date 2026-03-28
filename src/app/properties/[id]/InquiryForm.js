'use client';

import posthog from 'posthog-js';

export default function InquiryForm({ propertyId, propertyTitle }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        posthog.capture('property_inquiry_submitted', { property_id: propertyId, title: propertyTitle });
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-4">Your Identity</label>
                <input className="w-full bg-zinc-50 border border-zinc-100 px-5 py-4 text-sm focus:outline-none focus:border-zinc-950 transition-colors rounded-lg font-medium text-zinc-900" placeholder="FullName" />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-4">Digital Mail</label>
                <input className="w-full bg-zinc-50 border border-zinc-100 px-5 py-4 text-sm focus:outline-none focus:border-zinc-950 transition-colors rounded-lg font-medium text-zinc-900" placeholder="EmailAddress" />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-4">Intent</label>
                <textarea rows="4" className="w-full bg-zinc-50 border border-zinc-100 px-5 py-4 text-sm focus:outline-none focus:border-zinc-950 transition-colors rounded-lg resize-none font-medium text-zinc-900" placeholder="Message" />
            </div>
            <button type="submit" className="w-full bg-zinc-950 text-white py-5 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-all shadow-xl active:scale-[0.98]">
                Transmit Inquiry
            </button>
        </form>
    );
}
