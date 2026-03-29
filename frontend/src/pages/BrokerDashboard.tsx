import { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const BrokerDashboard = () => {
  const { user } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/properties/my-properties`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setList(response.data);
    } catch (error) {
      console.error('Error fetching broker properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleDelete = async (propertyId: string) => {
    if (!window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setList(prev => prev.filter(p => p._id !== propertyId));
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Failed to delete property");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
    </div>
  );

  return (
    <div className='p-8 md:p-16 bg-surface-off-white min-h-screen'>
      {/* Dashboard Header Profile */}
      <div className='flex flex-col gap-2'>
        <h1 className='text-sm font-Manrope-Bold tracking-widest text-gray-400 uppercase'>BROKER DASHBOARD</h1>
        <h2 className='text-5xl font-Manrope-ExtraBold text-slate-950'>Welcome back, {user?.name}</h2>
      </div>

      {/* Property Listings Area */}
      <section className='mt-20'>
        <div className="flex justify-between items-center mb-10">
          <h2 className='text-2xl font-Manrope-Bold text-gray-900'>My Listed Properties</h2>
          <Link to="/add-property" className="bg-slate-950 text-white px-6 py-2.5 rounded-md font-Manrope-Bold hover:bg-slate-800 transition">
             Add Property
          </Link>
        </div>
        
        {/* Render Active Grid or Empty State Box */}
        {list.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {list.map((prop: any) => (
              <PropertyCard 
                key={prop._id}
                id={prop._id}
                image={prop.coverImage}
                propertyTitle={prop.title}
                price={prop.price}
                location={prop.location}
                onDelete={() => handleDelete(prop._id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-lg">No listed properties yet.</p>
        )}
      </section>
    </div>
  );
};

export default BrokerDashboard;