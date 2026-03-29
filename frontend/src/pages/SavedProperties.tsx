import { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';

const SavedProperties = () => {
    const [savedList, setSavedList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { savedProperties } = useAuth();

    const fetchSaved = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/saved`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSavedList(response.data);
        } catch (error) {
            console.error('Error fetching saved:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSaved();
    }, []);
    useEffect(() => {
        setSavedList(prev => prev.filter((prop: any) => savedProperties.includes(prop._id)));
    }, [savedProperties]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-Manrope-ExtraBold text-slate-950 mb-2">My Saved Properties</h1>
                    <p className="text-gray-500 font-medium">Manage and view all your bookmarked listings in one place.</p>
                </header>

                {savedList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {savedList.map((prop: any) => (
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
            </div>
        </div>
    );
};

export default SavedProperties;