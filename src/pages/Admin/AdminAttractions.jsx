import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

export default function AdminAttractions() {
    const [attractions, setAttractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        title_nepali: '',
        description: '',
        image_url: '',
        display_order: 0
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchAttractions();
    }, []);

    async function fetchAttractions() {
        try {
            const { data, error } = await supabase
                .from('bandipur_attractions')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setAttractions(data || []);
        } catch (error) {
            console.error('Error fetching attractions:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleImageUpload(e) {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `attractions/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('bandipur_attractions')
                    .update(formData)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('bandipur_attractions')
                    .insert([formData]);
                if (error) throw error;
            }

            fetchAttractions();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving attraction:', error);
            alert('Failed to save attraction');
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this attraction?')) return;

        try {
            const { error } = await supabase
                .from('bandipur_attractions')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchAttractions();
        } catch (error) {
            console.error('Error deleting attraction:', error);
        }
    }

    function openModal(attraction = null) {
        if (attraction) {
            setEditingId(attraction.id);
            setFormData({
                title: attraction.title,
                title_nepali: attraction.title_nepali || '',
                description: attraction.description || '',
                image_url: attraction.image_url || '',
                display_order: attraction.display_order || 0
            });
        } else {
            setEditingId(null);
            setFormData({
                title: '',
                title_nepali: '',
                description: '',
                image_url: '',
                display_order: attractions.length + 1
            });
        }
        setIsModalOpen(true);
    }

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Major Attractions</h1>
                    <p className="text-gray-500 mt-1">Manage attractions displayed on About page</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} />
                    Add Attraction
                </button>
            </div>

            <div className="admin-card">
                {loading ? (
                    <div className="p-8 text-center">Loading...</div>
                ) : attractions.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Attractions Yet</h3>
                        <p>Click "Add Attraction" to list a new place.</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Nepali Title</th>
                                <th>Order</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attractions.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={item.title}
                                                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                        ) : (
                                            <div style={{ width: 50, height: 50, background: '#eee', borderRadius: '4px' }} />
                                        )}
                                    </td>
                                    <td><strong>{item.title}</strong></td>
                                    <td>{item.title_nepali}</td>
                                    <td>{item.display_order}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" onClick={() => openModal(item)}>
                                                <Pencil size={16} />
                                            </button>
                                            <button className="p-2 text-red-600 hover:bg-red-50 rounded" onClick={() => handleDelete(item.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editingId ? 'Edit Attraction' : 'Add Attraction'}</h3>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label">Title (English)</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Title (Nepali)</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.title_nepali}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title_nepali: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Image</label>
                                    {formData.image_url && (
                                        <img src={formData.image_url} alt="Preview" className="mb-2 h-20 rounded" />
                                    )}
                                    <input
                                        type="file"
                                        className="form-input"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <input
                                        type="text"
                                        className="form-input mt-2"
                                        placeholder="Or paste image URL..."
                                        value={formData.image_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Display Order</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.display_order}
                                        onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={uploading}>
                                    <Save size={16} /> Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
