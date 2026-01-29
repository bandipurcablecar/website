import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, X, Save, GripVertical } from 'lucide-react';

export default function AdminShareholders() {
    const [shareholders, setShareholders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        share_percentage: '',
        description: '',
        address: '',
        website_url: '',
        logo_url: '',
        education: '',
        directors: '', // Stored as newline separated string for editing
        experience: '', // Stored as newline separated string for editing
        display_order: 0
    });

    useEffect(() => {
        fetchShareholders();
    }, []);

    async function fetchShareholders() {
        try {
            const { data, error } = await supabase
                .from('basic_shareholders')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setShareholders(data || []);
        } catch (error) {
            console.error('Error fetching shareholders:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogoUpload(e) {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `shareholder-logo-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `logos/${fileName}`; // Using common 'logos' folder pattern if bucket exists or 'images'

            // Default to 'images' bucket or creates it if not exists conceptually (usually pre-existing)
            const { error: uploadError } = await supabase.storage
                .from('documents') // Reusing 'documents' bucket we know works
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, logo_url: publicUrl }));
        } catch (error) {
            console.error('Error uploading logo:', error);
            alert('Failed to upload logo');
        } finally {
            setUploading(false);
        }
    }

    function openModal(item = null) {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name || '',
                share_percentage: item.share_percentage || '',
                description: item.description || '',
                address: item.address || '',
                website_url: item.website_url || '',
                logo_url: item.logo_url || '',
                education: item.education || '',
                directors: Array.isArray(item.directors) ? item.directors.join('\n') : '',
                experience: Array.isArray(item.experience) ? item.experience.join('\n') : '',
                display_order: item.display_order || 0
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                share_percentage: '',
                description: '',
                address: '',
                website_url: '',
                logo_url: '',
                education: '',
                directors: '',
                experience: '',
                display_order: shareholders.length + 1
            });
        }
        setIsModalOpen(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // Convert newline separated strings back to arrays
        const directorsArray = formData.directors.split('\n').map(s => s.trim()).filter(Boolean);
        const experienceArray = formData.experience.split('\n').map(s => s.trim()).filter(Boolean);

        const dataToSave = {
            name: formData.name,
            share_percentage: formData.share_percentage,
            description: formData.description,
            address: formData.address,
            website_url: formData.website_url,
            logo_url: formData.logo_url,
            education: formData.education,
            directors: directorsArray,
            experience: experienceArray,
            display_order: parseInt(formData.display_order)
        };

        try {
            if (editingItem) {
                const { error } = await supabase
                    .from('basic_shareholders')
                    .update(dataToSave)
                    .eq('id', editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('basic_shareholders')
                    .insert([dataToSave]);
                if (error) throw error;
            }

            fetchShareholders();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving shareholder:', error);
            alert('Failed to save shareholder');
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this shareholder?')) return;

        try {
            const { error } = await supabase
                .from('basic_shareholders')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchShareholders();
        } catch (error) {
            console.error('Error deleting shareholder:', error);
        }
    }

    return (
        <div className="admin-shareholders">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Basic Shareholders</h1>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} />
                    Add Shareholder
                </button>
            </div>

            <div className="admin-card">
                {loading ? (
                    <div className="empty-state">
                        <div className="loading-spinner"></div>
                    </div>
                ) : shareholders.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Shareholders Found</h3>
                        <p>Click "Add Shareholder" to add entries.</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Logo</th>
                                <th>Name</th>
                                <th>Share %</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shareholders.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.display_order}</td>
                                    <td>
                                        {item.logo_url ? (
                                            <img src={item.logo_url} alt={item.name} style={{ height: 40, width: 'auto', maxWidth: 80, objectFit: 'contain' }} />
                                        ) : (
                                            <span className="text-gray-400 text-sm">No Logo</span>
                                        )}
                                    </td>
                                    <td>
                                        <strong>{item.name}</strong>
                                        {item.address && <div className="text-sm text-gray-500">{item.address}</div>}
                                    </td>
                                    <td>{item.share_percentage}</td>
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
                            <h3 className="modal-title">{editingItem ? 'Edit Shareholder' : 'Add Shareholder'}</h3>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Name / Entity</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Share Percentage</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.share_percentage}
                                            onChange={(e) => setFormData(prev => ({ ...prev, share_percentage: e.target.value }))}
                                            placeholder="e.g. 16.13%"
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

                                {/* Logo Upload Field */}
                                <div className="form-group">
                                    <label className="form-label">Company Logo</label>
                                    {formData.logo_url && (
                                        <div className="mb-2 p-2 border border-gray-200 rounded bg-gray-50 inline-block">
                                            <img src={formData.logo_url} alt="Logo Preview" style={{ height: 60, objectFit: 'contain' }} />
                                            <button
                                                type="button"
                                                className="btn btn-outline btn-sm mt-2 block w-full text-xs"
                                                onClick={() => setFormData(prev => ({ ...prev, logo_url: '' }))}
                                            >
                                                Remove Logo
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="file"
                                            className="form-input"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                        />
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Or paste image URL..."
                                            value={formData.logo_url}
                                            onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Address (Optional)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.address}
                                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Website URL (Optional)</label>
                                    <input
                                        type="url"
                                        className="form-input"
                                        value={formData.website_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Education (Optional)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.education}
                                        onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                                    />
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
                                    <label className="form-label">Directors / Key People (One per line)</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.directors}
                                        onChange={(e) => setFormData(prev => ({ ...prev, directors: e.target.value }))}
                                        rows={4}
                                        placeholder="Name (Position)"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Experience (One per line)</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.experience}
                                        onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                                        rows={4}
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
                </div >
            )
            }
        </div >
    );
}
