import Link from 'next/link';
import Image from 'next/image';

const PropertyCard = ({ property }) => {
    const { id, title, price, location, type, bedrooms, bathrooms, status, property_images } = property;
    const imageUrl = property_images?.[0]?.image_url || 'https://via.placeholder.com/400x300';

    return (
        <Link href={`/properties/${id}`} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl bg-zinc-900 border border-white/5 transition-all group-hover:border-white/20 aspect-[4/3]">
                <img
                    src={imageUrl}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${status === 'sold' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                        {status || 'available'}
                    </span>
                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-zinc-900/80 text-zinc-100 backdrop-blur-md rounded-sm">
                        {type}
                    </span>
                </div>
            </div>
            <div className="mt-4 space-y-1">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{title}</h3>
                    <span className="text-lg font-bold text-white tracking-widest leading-none">${price.toLocaleString()}</span>
                </div>
                <p className="text-sm text-zinc-400">{location}</p>
                <div className="flex gap-4 mt-2 text-xs font-medium text-zinc-500 uppercase tracking-widest border-t border-zinc-900 pt-3">
                    <span className="flex items-center gap-1">
                        <strong className="text-zinc-300">{bedrooms}</strong> beds
                    </span>
                    <span className="flex items-center gap-1">
                        <strong className="text-zinc-300">{bathrooms}</strong> baths
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default PropertyCard;
