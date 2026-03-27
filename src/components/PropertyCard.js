import Link from 'next/link';
import Image from 'next/image';

const PropertyCard = ({ property }) => {
    const { id, title, price, location, type, bedrooms, bathrooms, status, property_images } = property;
    const imageUrl = property_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop';

    return (
        <Link href={`/properties/${id}`} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl bg-zinc-50 border border-zinc-100 transition-all group-hover:border-emerald-200 aspect-[4/3] shadow-sm">
                <img
                    src={imageUrl}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${status === 'sold' ? 'bg-zinc-900 text-white' : 'bg-emerald-500 text-white'}`}>
                        {status || 'available'}
                    </span>
                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/90 text-zinc-900 backdrop-blur-md rounded-sm border border-zinc-100">
                        {type}
                    </span>
                </div>
            </div>
            <div className="mt-4 space-y-1">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-zinc-950 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{title}</h3>
                    <span className="text-lg font-bold text-zinc-900 tracking-widest leading-none">${price.toLocaleString()}</span>
                </div>
                <p className="text-sm text-zinc-400 font-medium italic">{location}</p>
                <div className="flex gap-6 mt-4 text-[10px] font-black text-zinc-300 uppercase tracking-widest border-t border-zinc-100 pt-4">
                    <span className="flex items-center gap-1">
                        <strong className="text-zinc-600 font-bold">{bedrooms}</strong> beds
                    </span>
                    <span className="flex items-center gap-1">
                        <strong className="text-zinc-600 font-bold">{bathrooms}</strong> baths
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default PropertyCard;
