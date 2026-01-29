import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X, ExternalLink } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import './AdminPages.css';

export default function AdminPages() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPage, setEditingPage] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        meta_description: '',
        meta_keywords: '',
        is_published: false,
        show_in_menu: false,
        menu_order: 0,
        parent_menu: ''
    });

    useEffect(() => {
        fetchPages();
    }, []);

    async function fetchPages() {
        try {
            const { data, error } = await supabase
                .from('custom_pages')
                .select('*')
                .order('menu_order', { ascending: true });

            if (error) throw error;
            setPages(data || []);
        } catch (error) {
            console.error('Error fetching pages:', error);
        } finally {
            setLoading(false);
        }
    }

    function openModal(page = null) {
        if (page) {
            setEditingPage(page);
            setFormData({
                title: page.title,
                slug: page.slug,
                content: page.content,
                meta_description: page.meta_description || '',
                meta_keywords: page.meta_keywords || '',
                is_published: page.is_published,
                show_in_menu: page.show_in_menu,
                menu_order: page.menu_order || 0,
                parent_menu: page.parent_menu || ''
            });
        } else {
            setEditingPage(null);
            setFormData({
                title: '',
                slug: '',
                content: '',
                meta_description: '',
                meta_keywords: '',
                is_published: false,
                show_in_menu: false,
                menu_order: 0,
                parent_menu: ''
            });
        }
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setEditingPage(null);
    }

    function generateSlug(title) {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const pageData = {
                ...formData,
                updated_at: new Date().toISOString()
            };

            if (editingPage) {
                const { error } = await supabase
                    .from('custom_pages')
                    .update(pageData)
                    .eq('id', editingPage.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('custom_pages')
                    .insert([pageData]);
                if (error) throw error;
            }

            fetchPages();
            closeModal();
            alert(editingPage ? 'Page updated successfully!' : 'Page created successfully!');
        } catch (error) {
            console.error('Error saving page:', error);
            alert('Failed to save page: ' + error.message);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) return;

        try {
            const { error } = await supabase
                .from('custom_pages')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchPages();
            alert('Page deleted successfully!');
        } catch (error) {
            console.error('Error deleting page:', error);
            alert('Failed to delete page');
        }
    }

    async function togglePublish(id, currentStatus) {
        try {
            const { error } = await supabase
                .from('custom_pages')
                .update({ is_published: !currentStatus })
                .eq('id', id);
            if (error) throw error;
            fetchPages();
        } catch (error) {
            console.error('Error toggling publish status:', error);
        }
    }

    // Quill editor modules configuration
    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            ['clean']
        ]
    }), []);

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'script',
        'list', 'bullet',
        'indent',
        'align',
        'blockquote', 'code-block',
        'link', 'image', 'video'
    ];

    if (loading) {
        return <div className="admin-page"><div className="loading">Loading pages...</div></div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Custom Pages</h1>
                    <p className="admin-page-subtitle">Create and manage dynamic pages with rich content</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={20} /> New Page
                </button>
            </div>

            <div className="admin-card">
                {pages.length === 0 ? (
                    <div className="empty-state">
                        <p>No pages created yet. Click "New Page" to get started!</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Slug</th>
                                    <th>Status</th>
                                    <th>In Menu</th>
                                    <th>Order</th>
                                    <th>Updated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages.map(page => (
                                    <tr key={page.id}>
                                        <td className="font-medium">{page.title}</td>
                                        <td>
                                            <code className="slug-code">/{page.slug}</code>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${page.is_published ? 'published' : 'draft'}`}>
                                                {page.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td>
                                            {page.show_in_menu ? (
                                                <span className="text-green-600">✓ Yes</span>
                                            ) : (
                                                <span className="text-gray-400">No</span>
                                            )}
                                        </td>
                                        <td>{page.menu_order}</td>
                                        <td className="text-sm text-gray-500">
                                            {new Date(page.updated_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-icon"
                                                    onClick={() => togglePublish(page.id, page.is_published)}
                                                    title={page.is_published ? 'Unpublish' : 'Publish'}
                                                >
                                                    {page.is_published ? <Eye size={18} /> : <EyeOff size={18} />}
                                                </button>
                                                {page.is_published && (
                                                    <a
                                                        href={`/${page.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-icon"
                                                        title="View Page"
                                                    >
                                                        <ExternalLink size={18} />
                                                    </a>
                                                )}
                                                <button
                                                    className="btn-icon"
                                                    onClick={() => openModal(page)}
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    className="btn-icon text-red-500"
                                                    onClick={() => handleDelete(page.id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Page Editor Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content page-editor-modal">
                        <div className="modal-header">
                            <h3>{editingPage ? 'Edit Page' : 'Create New Page'}</h3>
                            <button onClick={closeModal}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group flex-1">
                                        <label className="form-label">Page Title *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.title}
                                            onChange={(e) => {
                                                const title = e.target.value;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    title,
                                                    slug: editingPage ? prev.slug : generateSlug(title)
                                                }));
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="form-group flex-1">
                                        <label className="form-label">Slug (URL) *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.slug}
                                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                            required
                                        />
                                        <small className="text-gray-500">URL: /{formData.slug}</small>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Page Content *</label>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                                        modules={modules}
                                        formats={formats}
                                        className="rich-editor"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Meta Description (SEO)</label>
                                    <textarea
                                        className="form-textarea"
                                        rows={3}
                                        value={formData.meta_description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                                        placeholder="Short description for search engines (150-160 characters)"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Meta Keywords (SEO)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.meta_keywords}
                                        onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Menu Order</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.menu_order}
                                            onChange={(e) => setFormData(prev => ({ ...prev, menu_order: parseInt(e.target.value) || 0 }))}
                                        />
                                        <small className="text-gray-500">
                                            Default: Who We Are (10), What We Do (20), Investors (30).
                                            Use values like 15 to insert in between.
                                        </small>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Parent Menu</label>
                                        <select
                                            className="form-select"
                                            value={formData.parent_menu}
                                            onChange={(e) => setFormData(prev => ({ ...prev, parent_menu: e.target.value }))}
                                        >
                                            <option value="">None (Top Level)</option>
                                            <option value="who-we-are">Who We Are</option>
                                            <option value="what-we-do">What We Do</option>
                                            <option value="investors">Investors</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_published}
                                                onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                                            />
                                            <span>Publish page (make it visible to public)</span>
                                        </label>
                                    </div>
                                    <div className="form-group checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.show_in_menu}
                                                onChange={(e) => setFormData(prev => ({ ...prev, show_in_menu: e.target.checked }))}
                                            />
                                            <span>Show in navigation menu</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <Save size={18} /> {editingPage ? 'Update Page' : 'Create Page'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
