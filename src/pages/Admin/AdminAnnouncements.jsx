import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, X, Save, ToggleLeft, ToggleRight, Star } from 'lucide-react';

export default function AdminAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        link_url: '',
        link_label: 'Read More',
        is_featured: false,
        is_active: true,
        published_at: new Date().toISOString()
    });

    useEffect(() => { fetchData(); }, []);

    async function fetchData() {
        try {
            const { data, error } = await supabase.from('announcements').select('*').order('published_at', { ascending: false });
            if (error) throw error;
            setAnnouncements(data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    function openModal(item = null) {
        if (item) {
            setEditing(item);
            setFormData({
                title: item.title,
                content: item.content || '',
                link_url: item.link_url || '',
                link_label: item.link_label || 'Read More',
                is_featured: item.is_featured,
                is_active: item.is_active,
                published_at: item.published_at
            });
        } else {
            setEditing(null);
            setFormData({
                title: '',
                content: '',
                link_url: '',
                link_label: 'Read More',
                is_featured: false,
                is_active: true,
                published_at: new Date().toISOString()
            });
        }
        setIsModalOpen(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editing) {
                await supabase.from('announcements').update(formData).eq('id', editing.id);
            } else {
                await supabase.from('announcements').insert([formData]);
            }
            fetchData();
            setIsModalOpen(false);
        } catch (error) {
            alert('Failed to save');
        }
    }

    async function toggleFeatured(item) {
        await supabase.from('announcements').update({ is_featured: !item.is_featured }).eq('id', item.id);
        fetchData();
    }

    async function toggleActive(item) {
        await supabase.from('announcements').update({ is_active: !item.is_active }).eq('id', item.id);
        fetchData();
    }

    async function handleDelete(id) {
        if (!confirm('Delete this announcement?')) return;
        await supabase.from('announcements').delete().eq('id', id);
        fetchData();
    }

    return (
        <div className="admin-announcements">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Announcements</h1>
                <button className="btn btn-primary" onClick={() => openModal()}><Plus size={18} /> Add Announcement</button>
            </div>
            <div className="admin-card">
                {loading ? <div className="empty-state"><div className="loading-spinner"></div></div> : announcements.length === 0 ? <div className="empty-state"><h3>No Announcements Yet</h3></div> : (
                    <table className="admin-table">
                        <thead><tr><th>Title</th><th>Featured</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                        <tbody>
                            {announcements.map((item) => (
                                <tr key={item.id}>
                                    <td><strong>{item.title}</strong></td>
                                    <td><button onClick={() => toggleFeatured(item)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Star size={20} fill={item.is_featured ? 'var(--color-accent)' : 'none'} color={item.is_featured ? 'var(--color-accent)' : 'var(--color-gray-400)'} /></button></td>
                                    <td><button onClick={() => toggleActive(item)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>{item.is_active ? <ToggleRight size={24} color="var(--color-success)" /> : <ToggleLeft size={24} color="var(--color-gray-400)" />}</button></td>
                                    <td>{new Date(item.published_at).toLocaleDateString()}</td>
                                    <td><div className="table-actions"><button className="table-action" onClick={() => openModal(item)}><Pencil size={16} /></button><button className="table-action delete" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h3>{editing ? 'Edit' : 'Add'} Announcement</h3><button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={20} /></button></div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group"><label className="form-label">Title</label><input type="text" className="form-input" value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} required /></div>
                                <div className="form-group"><label className="form-label">Content</label><textarea className="form-textarea" value={formData.content} onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))} rows={4} /></div>
                                <div className="form-group"><label className="form-label">Link URL</label><input type="url" className="form-input" value={formData.link_url} onChange={(e) => setFormData(p => ({ ...p, link_url: e.target.value }))} /></div>
                                <div className="form-group"><label className="form-label">Link Label</label><input type="text" className="form-input" value={formData.link_label} onChange={(e) => setFormData(p => ({ ...p, link_label: e.target.value }))} /></div>
                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.published_at ? formData.published_at.split('T')[0] : ''}
                                        onChange={(e) => setFormData(p => ({ ...p, published_at: new Date(e.target.value).toISOString() }))}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData(p => ({ ...p, is_featured: e.target.checked }))} />
                                        Featured in Ticker
                                    </label>
                                </div>
                            </div>
                            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button><button type="submit" className="btn btn-primary"><Save size={16} /> Save</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
