import { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';

function Properties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/properties/all`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  if (loading){
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className='p-8 bg-surface-off-white min-h-screen'>
      <h1 className='text-3xl font-Manrope-ExtraBold text-slate-900 mb-10'>All Properties</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        {properties.length > 0 ? (
          properties.map(prop => (
            <PropertyCard 
              key={prop._id}
              id={prop._id}
              image={prop.coverImage}
              propertyTitle={prop.title}
              price={prop.price}
              location={prop.location}
            />
          ))
        ) : (
          <p className="text-gray-500">No properties listed yet.</p>
        )}
      </div>
    </div>
  )
}

export default Properties