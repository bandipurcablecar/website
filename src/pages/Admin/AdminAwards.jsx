import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, X, Save, Upload, Calendar } from 'lucide-react';

export default function AdminAwards() {
    const [awards, setAwards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        award_date: '',
        display_order: 0
    });

    useEffect(() => {
        fetchAwards();
    }, []);

    async function fetchAwards() {
        try {
            const { data, error } = await supabase
                .from('awards_recognitions')
                .select('*')
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAwards(data || []);
        } catch (error) {
            console.error('Error fetching awards:', error);
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
            const fileName = `award-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `awards/${fileName}`;

            // Ensure bucket exists or just use a common one ideally
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
            alert('Failed to upload image. Make sure you are logged in and have permission.');
        } finally {
            setUploading(false);
        }
    }

    function openModal(item = null) {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title || '',
                description: item.description || '',
                image_url: item.image_url || '',
                award_date: item.award_date || '',
                display_order: item.display_order || 0
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: '',
                description: '',
                image_url: '',
                award_date: new Date().toISOString().split('T')[0],
                display_order: awards.length + 1
            });
        }
        setIsModalOpen(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const dataToSave = {
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url,
            award_date: formData.award_date || null,
            display_order: parseInt(formData.display_order)
        };

        try {
            if (editingItem) {
                const { error } = await supabase
                    .from('awards_recognitions')
                    .update(dataToSave)
                    .eq('id', editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('awards_recognitions')
                    .insert([dataToSave]);
                if (error) throw error;
            }

            fetchAwards();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving award:', error);
            alert('Failed to save award');
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this award?')) return;

        try {
            const { error } = await supabase
                .from('awards_recognitions')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchAwards();
        } catch (error) {
            console.error('Error deleting award:', error);
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Awards & Recognitions</h1>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} />
                    Add Award
                </button>
            </div>

            <div className="admin-card">
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                    </div>
                ) : awards.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Awards Found</h3>
                        <p>Click "Add Award" to add entries.</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th width="60">Image</th>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Order</th>
                                <th width="100">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {awards.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs text-gray-400">No Img</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <strong>{item.title}</strong>
                                        <p className="text-sm text-gray-500 truncate max-w-xs">{item.description}</p>
                                    </td>
                                    <td>{item.award_date}</td>
                                    <td>{item.display_order}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="table-action" onClick={() => openModal(item)}>
                                                <Pencil size={16} />
                                            </button>
                                            <button className="table-action delete" onClick={() => handleDelete(item.id)}>
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
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editingItem ? 'Edit Award' : 'Add Award'}</h3>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Award Title</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        required
                                        placeholder="e.g. Best Tourism Project 2024"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Award Image</label>
                                    {formData.image_url && (
                                        <div className="mb-2 p-2 border border-gray-200 rounded bg-gray-50 inline-block">
                                            <img src={formData.image_url} alt="Preview" style={{ height: 100, objectFit: 'contain' }} />
                                            <button
                                                type="button"
                                                className="btn btn-outline btn-sm mt-2 block w-full text-xs"
                                                onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                            >
                                                Remove Image
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="file"
                                            className="form-input"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Or paste image URL..."
                                            value={formData.image_url}
                                            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Date (Optional)</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={formData.award_date}
                                            onChange={(e) => setFormData(prev => ({ ...prev, award_date: e.target.value }))}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Display Order</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.display_order}
                                            onChange={(e) => setFormData(prev => ({ ...prev, display_order: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={4}
                                        placeholder="Brief details about the award..."
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={uploading}>
                                    <Save size={16} /> {uploading ? 'Uploading...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
