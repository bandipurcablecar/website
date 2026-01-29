import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, X, Save, Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';

export default function AdminGallery() {
    const [galleryItems, setGalleryItems] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        image_url: ''
    });
    const [uploading, setUploading] = useState(false);
    const [cleaning, setCleaning] = useState(false);

    useEffect(() => {
        fetchGalleryItems();
        fetchProjects();
    }, []);

    async function fetchGalleryItems() {
        try {
            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setGalleryItems(data || []);
        } catch (error) {
            console.error('Error fetching gallery items:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchProjects() {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('slug, title')
                .order('title', { ascending: true });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }

    function openModal(item = null) {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title || '',
                description: item.description || '',
                category: item.category || '',
                image_url: item.image_url || ''
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: '',
                description: '',
                category: projects.length > 0 ? projects[0].slug : '',
                image_url: ''
            });
        }
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setEditingItem(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (editingItem) {
                const { error } = await supabase
                    .from('gallery')
                    .update(formData)
                    .eq('id', editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('gallery')
                    .insert([formData]);
                if (error) throw error;
            }

            fetchGalleryItems();
            closeModal();
        } catch (error) {
            console.error('Error saving gallery item:', error);
            alert('Failed to save gallery item');
        }
    }

    async function handleDelete(item) {
        if (!confirm('Are you sure you want to delete this image? This will also remove the file from storage.')) return;

        try {
            // 1. Delete from database
            const { error } = await supabase
                .from('gallery')
                .delete()
                .eq('id', item.id);
            if (error) throw error;

            // 2. Delete from storage if it exists
            if (item.image_url && item.image_url.includes('/documents/')) {
                const path = item.image_url.split('/documents/')[1];
                if (path) {
                    const { error: storageError } = await supabase.storage
                        .from('documents')
                        .remove([path]);

                    if (storageError) {
                        console.error('Error deleting file from storage:', storageError);
                    }
                }
            }

            fetchGalleryItems();
        } catch (error) {
            console.error('Error deleting gallery item:', error);
            alert('Failed to delete gallery item');
        }
    }

    async function handleCleanup() {
        if (!confirm('This will scan the "gallery" storage folder and DELETE any images not currently used in the Gallery database. This cannot be undone. Are you sure?')) return;

        setCleaning(true);
        try {
            // 1. Get all currently used image paths from the gallery table
            const { data: dbItems, error: dbError } = await supabase
                .from('gallery')
                .select('image_url');

            if (dbError) throw dbError;

            const usedPaths = new Set(
                dbItems
                    .map(item => item.image_url)
                    .filter(url => url && url.includes('/documents/'))
                    .map(url => url.split('/documents/')[1]) // e.g., 'gallery/filename.jpg'
            );

            // 2. List all files in the 'gallery' folder of the 'documents' bucket
            // strict limit handling might be needed if > 1000 files, defaulting to 1000 which is usually plenty for this scale
            const { data: files, error: listError } = await supabase.storage
                .from('documents')
                .list('gallery', { limit: 1000, offset: 0 });

            if (listError) throw listError;

            // 3. Identify orphans
            // The list() method returns files relative to the folder, so we prepend 'gallery/'
            const orphans = files
                .filter(file => file.name !== '.emptyFolderPlaceholder') // Ignore placeholders
                .map(file => `gallery/${file.name}`)
                .filter(path => !usedPaths.has(path));

            if (orphans.length === 0) {
                alert('Storage is clean! No orphaned images found in the gallery folder.');
                return;
            }

            // 4. Delete orphans
            const { error: deleteError } = await supabase.storage
                .from('documents')
                .remove(orphans);

            if (deleteError) throw deleteError;

            alert(`Cleanup successful! Deleted ${orphans.length} orphaned image(s) from storage.`);

        } catch (error) {
            console.error('Cleanup failed:', error);
            alert('Failed to cleanup storage. Check console for details.');
        } finally {
            setCleaning(false);
        }
    }

    async function handleImageUpload(e) {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `gallery/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(fileName);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Make sure you have permission.');
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="admin-gallery">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Gallery Management</h1>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} />
                    Add Image
                </button>
            </div>

            <div className="admin-actions-bar mb-4 flex justify-end">
                <button
                    className="btn btn-outline text-sm flex items-center gap-2"
                    onClick={handleCleanup}
                    disabled={cleaning}
                    title="Delete files from storage that are not linked to any gallery item"
                >
                    <RefreshCw size={14} className={cleaning ? 'animate-spin' : ''} />
                    {cleaning ? 'Cleaning...' : 'Cleanup Storage'}
                </button>
            </div>

            <div className="admin-card">
                {loading ? (
                    <div className="empty-state">
                        <div className="loading-spinner"></div>
                        <p>Loading gallery items...</p>
                    </div>
                ) : galleryItems.length === 0 ? (
                    <div className="empty-state">
                        <ImageIcon size={48} className="text-gray-300" />
                        <h3>No Images Yet</h3>
                        <p>Click "Add Image" to start building your gallery.</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Details</th>
                                <th>Category (Project)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {galleryItems.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <img
                                            src={item.image_url || 'https://via.placeholder.com/60x40'}
                                            alt={item.title}
                                            style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                        />
                                    </td>
                                    <td>
                                        <strong>{item.title}</strong>
                                        {item.description && (
                                            <p className="text-sm text-gray-500 truncate max-w-xs">{item.description}</p>
                                        )}
                                    </td>
                                    <td>
                                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                className="table-action"
                                                onClick={() => openModal(item)}
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                className="table-action delete"
                                                onClick={() => handleDelete(item)}
                                                title="Delete"
                                            >
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

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {editingItem ? 'Edit Image' : 'Add New Image'}
                            </h3>
                            <button className="modal-close" onClick={closeModal}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Image Title"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Project / Category</label>
                                    <select
                                        className="form-select"
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        required
                                    >
                                        <option value="" disabled>Select a Project</option>
                                        {projects.map(p => (
                                            <option key={p.slug} value={p.slug}>
                                                {p.title} ({p.slug})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                        placeholder="Optional description..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Image</label>

                                    {/* Image Preview */}
                                    {formData.image_url && (
                                        <div className="mb-3 relative group">
                                            <img
                                                src={formData.image_url}
                                                alt="Preview"
                                                className="w-full h-40 object-cover rounded-md border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-3">
                                        <label className={`flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            <Upload size={20} className="text-gray-500" />
                                            <span className="text-sm font-medium text-gray-600">
                                                {uploading ? 'Uploading...' : 'Click to Upload Image'}
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                                className="hidden"
                                            />
                                        </label>

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-gray-200"></span>
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-white px-2 text-gray-500">Or use URL</span>
                                            </div>
                                        </div>

                                        <input
                                            type="url"
                                            className="form-input"
                                            value={formData.image_url}
                                            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                            placeholder="https://example.com/image.jpg"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={uploading}>
                                    <Save size={16} />
                                    {editingItem ? 'Update' : 'Add Image'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
