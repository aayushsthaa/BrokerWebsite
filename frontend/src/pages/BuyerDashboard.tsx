import PropertyCard from '../components/PropertyCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const { user, savedProperties } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setList(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSaved();
  }, []);

  useEffect(() => {
    setList(prev => prev.filter((prop: any) => savedProperties.includes(prop._id)));
  }, [savedProperties]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
    </div>
  );

  return (
    <div className='p-8 md:p-16 bg-surface-off-white min-h-screen'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-sm font-Manrope-Bold tracking-widest text-gray-400 uppercase'>BUYER DASHBOARD</h1>
        <h2 className='text-5xl font-Manrope-ExtraBold text-slate-950'>Welcome back, {user?.name}</h2>
      </div>
      {/* Saved */}
      <section className='mt-20'>
        <div className="flex justify-between items-center mb-10">
          <h2 className='text-2xl font-Manrope-Bold text-gray-900'>My Saved Listings</h2>
          {list.length > 0 && (
            <Link to="/saved" className="text-slate-900 underline font-semibold">View All</Link>
          )}
        </div>
        
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
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-lg">No saved properties yet.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
