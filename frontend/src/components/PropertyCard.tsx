import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface PropertyCardProps {
    id: string,
    image: string,
    propertyTitle: string,
    price: number,
    location: string,
    onDelete?: () => void
}

const PropertyCard: React.FC<PropertyCardProps> = ({ id, image, propertyTitle, price, location, onDelete }) => {
    const { toggleSavedProperty, savedProperties, user } = useAuth();
    const isSaved = savedProperties.includes(id);

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); 
        toggleSavedProperty(id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onDelete) onDelete();
    };

    const imageUrl = image;

    return (
        <Link to={`/property/${id}`} className='block w-full group'>
            <div className='p-2 hover:bg-gray-100 rounded-2xl cursor-pointer relative'>
                <div className='relative overflow-hidden rounded-xl h-52 mb-3'>
                    <img src={imageUrl} alt={propertyTitle} className='w-full h-full object-cover group-hover:scale-105 transition-transform' />
                    
                    {user?.role === 'Buyer' && (
                        <button 
                            onClick={handleSave}
                            className={`absolute top-3 right-3 p-2 rounded-full ${isSaved ? 'bg-slate-900 text-white' : 'bg-white/70 text-gray-900 hover:bg-white'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </button>
                    )}

                    {onDelete && (
                        <button 
                            onClick={handleDelete}
                            className="absolute top-3 left-3 p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
                
                <div className='px-1'>
                    <div className='flex justify-between items-start mb-1'>
                        <h2 className='font-Manrope-Bold text-lg text-slate-900 w-2/3 truncate'>{propertyTitle}</h2>
                        <p className='font-Manrope-Bold text-slate-950'>${price.toLocaleString()}</p>
                    </div>
                    <p className='text-gray-500 text-sm flex items-center gap-1'>
                        {location}
                    </p>
                </div>
            </div>
        </Link>
    )
}

export default PropertyCard