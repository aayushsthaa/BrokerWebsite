import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PropertyDetails = () => {
  const { id } = useParams();
  const { toggleSavedProperty, savedProperties, user, loading: authLoading } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isSaved = id ? savedProperties.includes(id) : false;

  const handleSave = () => {
    if (id) toggleSavedProperty(id);
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!property) {
    return <div className="p-20 text-center text-xl text-gray-500">Property not found</div>;
  }

  return (
    <div className="bg-white min-h-screen font-Manrope">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <img 
          src={property.coverImage} 
          alt={property.title} 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm font-Manrope-Bold tracking-[0.3em] uppercase opacity-70 mb-4">{property.location}</p>
            <h1 className="text-6xl md:text-8xl font-Manrope-ExtraBold leading-tight mb-2 tracking-tighter">
              {property.title}
            </h1>
            <p className="text-3xl md:text-4xl font-Manrope-Light opacity-80 mb-12">
              ${property.price.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-8 md:px-16 py-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-8">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-slate-950 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {property.owner?.name?.charAt(0) || "B"}
                </div>
                <div className="text-left">
                    <p className="text-[10px] tracking-widest uppercase text-gray-400 font-Manrope-Bold mb-1">Listed By</p>
                    <p className="font-Manrope-ExtraBold text-slate-950 text-xl leading-none">{property.owner?.name || "Exclusive Broker"}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                {user?.role === 'Buyer' && (
                <button 
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-8 py-4 rounded-md font-Manrope-Bold transition shadow-sm ${isSaved ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    {isSaved ? 'Saved' : 'Save Property'}
                </button>
                )}
                <a href="#" className="bg-slate-950 text-white px-10 py-4 rounded-md font-Manrope-Bold hover:bg-slate-800 transition shadow-2xl shadow-slate-200 text-center">
                    Contact Broker
                </a>
            </div>
        </div>
      </section>

      {/* Property Details Section */}
      <section className="py-24 px-8 bg-[#fdfdfd]">
        <div className="max-w-4xl mx-auto text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-8 font-Manrope-Bold underline underline-offset-8">Property Description</p>
            <div className="max-w-3xl mx-auto space-y-8 text-gray-600 text-xl leading-relaxed font-Manrope-Medium">
                <p className="whitespace-pre-wrap">{property.description}</p>
            </div>
        </div>
      </section>
      {property.images.length > 0 && (
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-Manrope-Bold underline underline-offset-8">Property Gallery</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {property.images?.map((img: string, i: number) => (
            <div key={i} className="group cursor-pointer">
              <div className="overflow-hidden rounded-sm">
                <img 
                  src={img} 
                  alt={`Exquisite View ${i+1}`} 
                  className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    )}
    </div>
  );
};

export default PropertyDetails;
