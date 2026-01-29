import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, Trash2, FileText, Download, X, Search, Filter, Plus, Tag, Edit2 } from 'lucide-react';

export default function AdminDownloads() {
    const [documents, setDocuments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingDoc, setEditingDoc] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: '', // Will default to first available
        fiscal_year: '',
        published_at: new Date().toISOString().split('T')[0], // Default to today
        file: null
    });

    // Category Form State
    const [newCategoryLabel, setNewCategoryLabel] = useState('');
    const [submittingCategory, setSubmittingCategory] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            await Promise.all([fetchDocuments(), fetchCategories()]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchCategories() {
        const { data, error } = await supabase
            .from('document_categories')
            .select('*')
            .order('label');

        if (error) throw error;
        setCategories(data || []);

        // Set default category for form if not set
        if (data && data.length > 0 && !formData.category) {
            setFormData(prev => ({ ...prev, category: data[0].slug }));
        }
    }

    async function fetchDocuments() {
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        setDocuments(data || []);
    }

    async function handleAddCategory(e) {
        e.preventDefault();
        if (!newCategoryLabel.trim()) return;

        setSubmittingCategory(true);
        try {
            const slug = newCategoryLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            const { error } = await supabase
                .from('document_categories')
                .insert([{ label: newCategoryLabel, slug }]);

            if (error) throw error;

            await fetchCategories();
            setNewCategoryLabel('');
            // Optional: alert('Category added');
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Failed to add category. It may already exist.');
        } finally {
            setSubmittingCategory(false);
        }
    }

    async function handleDeleteCategory(id) {
        if (!confirm('Are you sure? This will not delete documents but will remove the category from the list.')) return;

        try {
            const { error } = await supabase
                .from('document_categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
        }
    }

    async function handleUpload(e) {
        e.preventDefault();

        // If editing, call update instead
        if (editingDoc) {
            return await handleUpdate(e);
        }

        if (!formData.file) return;

        setUploading(true);
        try {
            // 1. Upload file to Storage
            const fileExt = formData.file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${formData.category}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, formData.file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(filePath);

            // 3. Save to Database with custom publish date
            const { error: dbError } = await supabase
                .from('documents')
                .insert([{
                    title: formData.title,
                    category: formData.category,
                    fiscal_year: formData.fiscal_year,
                    file_url: publicUrl,
                    published_at: formData.published_at,
                    created_at: formData.published_at // Also set created_at to match
                }]);

            if (dbError) throw dbError;

            // Reset and Refresh
            closeForm();
            fetchDocuments();
            alert('Document uploaded successfully!');

        } catch (error) {
            console.error('Error uploading:', error);
            alert('Failed to upload document: ' + error.message);
        } finally {
            setUploading(false);
        }
    }

    function openEditModal(doc) {
        setEditingDoc(doc);
        setFormData({
            title: doc.title,
            category: doc.category,
            fiscal_year: doc.fiscal_year || '',
            published_at: doc.published_at ? new Date(doc.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            file: null
        });
        setShowForm(true);
    }

    async function handleUpdate(e) {
        e.preventDefault();
        setUploading(true);

        try {
            let fileUrl = editingDoc.file_url;

            // If new file is uploaded, replace the old one
            if (formData.file) {
                // Delete old file
                const oldPath = editingDoc.file_url.split('/documents/')[1];
                if (oldPath) {
                    await supabase.storage.from('documents').remove([oldPath]);
                }

                // Upload new file
                const fileExt = formData.file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `${formData.category}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(filePath, formData.file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('documents')
                    .getPublicUrl(filePath);

                fileUrl = publicUrl;
            }

            // Update database
            const { error: dbError } = await supabase
                .from('documents')
                .update({
                    title: formData.title,
                    category: formData.category,
                    fiscal_year: formData.fiscal_year,
                    file_url: fileUrl,
                    published_at: formData.published_at,
                    updated_at: new Date().toISOString()
                })
                .eq('id', editingDoc.id);

            if (dbError) throw dbError;

            closeForm();
            fetchDocuments();
            alert('Document updated successfully!');

        } catch (error) {
            console.error('Error updating:', error);
            alert('Failed to update document: ' + error.message);
        } finally {
            setUploading(false);
        }
    }

    function closeForm() {
        setShowForm(false);
        setEditingDoc(null);
        setFormData({
            title: '',
            category: categories[0]?.slug || '',
            fiscal_year: '',
            published_at: new Date().toISOString().split('T')[0],
            file: null
        });
    }

    async function handleDelete(id, fileUrl) {
        if (!confirm('Are you sure you want to delete this document?')) return;

        try {
            const path = fileUrl.split('/documents/')[1];
            if (path) {
                const { error: storageError } = await supabase.storage
                    .from('documents')
                    .remove([path]);
                if (storageError) console.error('Storage delete error:', storageError);
            }

            const { error: dbError } = await supabase
                .from('documents')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            setDocuments(docs => docs.filter(doc => doc.id !== id));

        } catch (error) {
            console.error('Error deleting:', error);
            alert('Failed to delete document');
        }
    }

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading && documents.length === 0) return <div className="p-8 text-center">Loading documents...</div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Downloads & Documents</h1>
                    <p className="text-gray-500 mt-1">Manage all downloadable content</p>
                </div>
                <div className="flex gap-2">
                    <button
                        className="btn btn-outline"
                        onClick={() => setShowCategoryModal(true)}
                    >
                        <Tag size={18} />
                        Manage Categories
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        <Upload size={18} />
                        Upload Document
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-filters">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.label}</option>
                    ))}
                </select>
            </div>

            {/* Document List */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Document</th>
                            <th>Category</th>
                            <th>Fiscal Year</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocs.map(doc => (
                            <tr key={doc.id}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded text-blue-600">
                                            <FileText size={20} />
                                        </div>
                                        <span className="font-medium text-gray-900">{doc.title}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge badge-gray">
                                        {categories.find(c => c.slug === doc.category)?.label || doc.category}
                                    </span>
                                </td>
                                <td className="text-gray-500">{doc.fiscal_year || '-'}</td>
                                <td className="text-gray-500">
                                    {new Date(doc.published_at || doc.created_at).toLocaleDateString()}
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <a
                                            href={doc.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-icon text-blue-600 hover:bg-blue-50"
                                            title="View"
                                        >
                                            <Download size={18} />
                                        </a>
                                        <button
                                            className="btn-icon text-green-600 hover:bg-green-50"
                                            onClick={() => openEditModal(doc)}
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            className="btn-icon text-red-600 hover:bg-red-50"
                                            onClick={() => handleDelete(doc.id, doc.file_url)}
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredDocs.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-500">
                                    No documents found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Upload/Edit Modal */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingDoc ? 'Edit Document' : 'Upload Document'}</h2>
                            <button onClick={closeForm} className="modal-close">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpload}>
                            <div className="form-group">
                                <label className="form-label">Document Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Annual Report 2080/81"
                                />
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.slug}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Fiscal Year (Optional)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.fiscal_year}
                                        onChange={e => setFormData({ ...formData, fiscal_year: e.target.value })}
                                        placeholder="e.g., 2080/81"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Publish Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    required
                                    value={formData.published_at}
                                    onChange={e => setFormData({ ...formData, published_at: e.target.value })}
                                />
                                <small className="text-gray-500 mt-1 block">Set custom publish date (for backdating documents)</small>
                            </div>

                            <div className="form-group">
                                <label className="form-label">File {editingDoc && '(leave empty to keep current)'}</label>
                                <div className="file-upload-box">
                                    <input
                                        type="file"
                                        required={!editingDoc}
                                        onChange={e => setFormData({ ...formData, file: e.target.files[0] })}
                                        className="file-input"
                                    />
                                    <div className="file-upload-placeholder">
                                        <Upload size={24} className="text-gray-400" />
                                        <p>Click to select or drag file here</p>
                                        {formData.file && (
                                            <div className="selected-file">
                                                Selected: <strong>{formData.file.name}</strong>
                                            </div>
                                        )}
                                        {editingDoc && !formData.file && (
                                            <div className="selected-file text-blue-600">
                                                Current: <strong>{editingDoc.title}</strong>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Upload Document'}
                                </button>
                            </div>
                        </form>
                    </div >
                </div >
            )
            }

            {/* Manage Categories Modal */}
            {
                showCategoryModal && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{ maxWidth: '400px' }}>
                            <div className="modal-header">
                                <h2>Manage Categories</h2>
                                <button onClick={() => setShowCategoryModal(false)} className="modal-close">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="category-list mb-6" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {categories.map(cat => (
                                    <div key={cat.id} className="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50">
                                        <span className="font-medium">{cat.label}</span>
                                        <button
                                            className="text-red-500 hover:bg-red-50 p-1 rounded"
                                            onClick={() => handleDeleteCategory(cat.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleAddCategory} className="border-t pt-4">
                                <label className="form-label">Add New Category</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newCategoryLabel}
                                        onChange={e => setNewCategoryLabel(e.target.value)}
                                        placeholder="Category Name"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={submittingCategory}
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            <style>{`
                .admin-filters {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                .search-box {
                    flex: 1;
                    position: relative;
                }
                .search-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #9ca3af;
                }
                .search-input {
                    width: 100%;
                    padding: 0.75rem 1rem 0.75rem 2.5rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                }
                .filter-select {
                    padding: 0.75rem 2rem 0.75rem 1rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    background-color: white;
                }
                .badge {
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    text-transform: capitalize;
                }
                .badge-gray { background: #f3f4f6; color: #374151; }

                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 50;
                }
                .modal-content {
                    background: white;
                    border-radius: 1rem;
                    width: 100%;
                    max-width: 500px;
                    padding: 2rem;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .modal-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    color: #6b7280;
                }
                .file-upload-box {
                    border: 2px dashed #e5e7eb;
                    border-radius: 0.75rem;
                    padding: 2rem;
                    text-align: center;
                    position: relative;
                    cursor: pointer;
                }
                .file-input {
                    position: absolute;
                    inset: 0;
                    opacity: 0;
                    cursor: pointer;
                }
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 2rem;
                }
            `}</style>
        </div >
    );
}
