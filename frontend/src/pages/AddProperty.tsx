import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AddProperty = () => {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        price: '',
        description: ''
    });
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [isPublishing, setIsPublishing] = useState(false);
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && user?.role !== 'Broker') {
            navigate('/');
        }
    }, [user, authLoading, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'gallery') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (type === 'cover') {
            const file = files[0];
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        } else {
            const selectedFiles = Array.from(files);
            setGalleryFiles(prev => [...prev, ...selectedFiles]);
            const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!coverFile) return alert("Please upload a cover image");
        
        setIsPublishing(true);
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('title', formData.title);
            data.append('location', formData.location);
            data.append('price', formData.price);
            data.append('description', formData.description);
            data.append('coverImage', coverFile);
            galleryFiles.forEach(file => {
                data.append('images', file);
            });

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/properties/add`, data, {
                headers: { 
                    Authorization: `Bearer ${token}`
                }
            });

            alert('Property listed successfully!');
            navigate('/properties');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to list property');
        } finally {
            setIsPublishing(false);
        }
    };

    if (authLoading) return <div className='flex items-center justify-center h-screen bg-gray-50'>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">List New Property</h1>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                    {/* Basic Property Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 font-bold mb-2">Title</label>
                            <input name="title" type="text" className="w-full p-4 bg-gray-100 rounded-xl" onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Price ($)</label>
                            <input name="price" type="number" className="w-full p-4 bg-gray-100 rounded-xl" onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Location</label>
                            <input name="location" type="text" className="w-full p-4 bg-gray-100 rounded-xl" onChange={handleChange} required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Description</label>
                        <textarea name="description" className="w-full p-4 bg-gray-100 rounded-xl h-32" onChange={handleChange} required />
                    </div>

                    {/*Image Uploads */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Cover Image</label>
                            <input 
                                type="file" 
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-Manrope-Bold file:bg-slate-100 file:text-slate-900 hover:file:bg-slate-200 transition cursor-pointer" 
                                onChange={(e) => handleFileChange(e, 'cover')} 
                                required={!coverFile} 
                            />
                            {coverPreview && (
                                <div className="relative w-fit mt-2">
                                    <img src={coverPreview} className="h-32 rounded-lg" />
                                    <button 
                                        type="button"
                                        onClick={() => {setCoverFile(null); setCoverPreview(null);}}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md"
                                    >✕</button>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Gallery Images</label>
                            <input 
                                type="file" 
                                multiple 
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-Manrope-Bold file:bg-slate-100 file:text-slate-900 hover:file:bg-slate-200 transition cursor-pointer" 
                                onChange={(e) => handleFileChange(e, 'gallery')} 
                            />
                            <div className="flex gap-4 mt-2 flex-wrap">
                                {galleryPreviews.map((preview, i) => (
                                    <div key={i} className="relative">
                                        <img src={preview} className="h-20 w-20 object-cover rounded shadow-sm" />
                                        <button 
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md"
                                        >✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isPublishing}
                        className="w-full bg-slate-950 text-white py-5 rounded-md font-bold text-lg hover:bg-slate-800 disabled:bg-gray-400"
                    >
                        {isPublishing ? 'Publishing...' : 'Publish Property'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProperty;
