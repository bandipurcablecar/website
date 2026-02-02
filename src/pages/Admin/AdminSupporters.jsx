import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, X, Save, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminSupporters() {
    const [supporters, setSupporters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupporter, setEditingSupporter] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        logo_url: '',
        website_url: '',
        display_order: 0,
        is_active: true,
        isFileUpload: false,
        logoFile: null
    });

    useEffect(() => { fetchSupporters(); }, []);

    async function fetchSupporters() {
        try {
            const { data, error } = await supabase.from('supporters').select('*').order('display_order', { ascending: true });
            if (error) throw error;
            setSupporters(data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    function openModal(supporter = null) {
        if (supporter) {
            setEditingSupporter(supporter);
            setFormData({
                name: supporter.name,
                role: supporter.role,
                logo_url: supporter.logo_url || '',
                website_url: supporter.website_url || '',
                display_order: supporter.display_order || 0,
                is_active: supporter.is_active,
                isFileUpload: false,
                logoFile: null
            });
        } else {
            setEditingSupporter(null);
            setFormData({
                name: '',
                role: '',
                logo_url: '',
                website_url: '',
                display_order: supporters.length,
                is_active: true,
                isFileUpload: false,
                logoFile: null
            });
        }
        setIsModalOpen(true);
    }

    function handleFileChange(e) {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                logoFile: e.target.files[0]
            }));
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            let finalLogoUrl = formData.logo_url;

            if (formData.isFileUpload && formData.logoFile) {
                const file = formData.logoFile;
                const fileExt = file.name.split('.').pop();
                const fileName = `associate-logos/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`; // Reuse associate-logos bucket folder

                const { error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('documents')
                    .getPublicUrl(fileName);

                finalLogoUrl = publicUrl;
            }

            const submissionData = {
                name: formData.name,
                role: formData.role,
                logo_url: finalLogoUrl,
                website_url: formData.website_url,
                display_order: formData.display_order,
                is_active: formData.is_active
            };

            if (editingSupporter) {
                await supabase.from('supporters').update(submissionData).eq('id', editingSupporter.id);
            } else {
                await supabase.from('supporters').insert([submissionData]);
            }
            fetchSupporters();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert('Failed to save');
        } finally {
            setLoading(false);
        }
    }

    async function toggleActive(s) {
        await supabase.from('supporters').update({ is_active: !s.is_active }).eq('id', s.id);
        fetchSupporters();
    }

    async function handleDelete(id) {
        if (!confirm('Delete this supporter?')) return;
        await supabase.from('supporters').delete().eq('id', id);
        fetchSupporters();
    }

    return (
        <div className="admin-supporters">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Supporters</h1>
                <button className="btn btn-primary" onClick={() => openModal()}><Plus size={18} /> Add Supporter</button>
            </div>
            <div className="admin-card">
                {loading ? <div className="empty-state"><div className="loading-spinner"></div></div> : supporters.length === 0 ? <div className="empty-state"><h3>No Supporters Yet</h3></div> : (
                    <table className="admin-table">
                        <thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {supporters.map((s) => (
                                <tr key={s.id}>
                                    <td><strong>{s.name}</strong></td>
                                    <td>{s.role}</td>
                                    <td><button onClick={() => toggleActive(s)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>{s.is_active ? <ToggleRight size={24} color="var(--color-success)" /> : <ToggleLeft size={24} color="var(--color-gray-400)" />}</button></td>
                                    <td><div className="table-actions"><button className="table-action" onClick={() => openModal(s)}><Pencil size={16} /></button><button className="table-action delete" onClick={() => handleDelete(s.id)}><Trash2 size={16} /></button></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h3>{editingSupporter ? 'Edit' : 'Add'} Supporter</h3><button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={20} /></button></div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group"><label className="form-label">Name</label><input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required /></div>
                                <div className="form-group"><label className="form-label">Role</label><input type="text" className="form-input" value={formData.role} onChange={(e) => setFormData(p => ({ ...p, role: e.target.value }))} required /></div>

                                <div className="form-group">
                                    <label className="form-label">Logo Source</label>
                                    <div className="input-type-toggle" style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="logoSource"
                                                checked={!formData.isFileUpload}
                                                onChange={() => setFormData(prev => ({ ...prev, isFileUpload: false }))}
                                            />
                                            <span>Image URL</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="logoSource"
                                                checked={formData.isFileUpload}
                                                onChange={() => setFormData(prev => ({ ...prev, isFileUpload: true }))}
                                            />
                                            <span>Upload Image</span>
                                        </label>
                                    </div>

                                    {formData.isFileUpload ? (
                                        <div className="file-upload-container">
                                            <input
                                                type="file"
                                                className="form-input"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                            {formData.logoFile && (
                                                <small className="text-success" style={{ display: 'block', marginTop: '0.25rem', color: 'green' }}>
                                                    Selected: {formData.logoFile.name}
                                                </small>
                                            )}
                                        </div>
                                    ) : (
                                        <input
                                            type="url"
                                            className="form-input"
                                            placeholder="https://example.com/logo.png"
                                            value={formData.logo_url}
                                            onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                                        />
                                    )}
                                    {/* Preview */}
                                    {(formData.logo_url || formData.logoFile) && (
                                        <div className="image-preview" style={{ marginTop: '0.5rem', padding: '0.5rem', border: '1px dashed #ddd', borderRadius: '4px', textAlign: 'center' }}>
                                            <span style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '0.25rem' }}>Preview</span>
                                            <img
                                                src={formData.isFileUpload && formData.logoFile ? URL.createObjectURL(formData.logoFile) : formData.logo_url}
                                                alt="Logo Preview"
                                                style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain' }}
                                                onError={(e) => e.target.style.display = 'none'}
                                                onLoad={(e) => e.target.style.display = 'inline-block'}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="form-group"><label className="form-label">Website URL</label><input type="url" className="form-input" value={formData.website_url} onChange={(e) => setFormData(p => ({ ...p, website_url: e.target.value }))} /></div>
                                <div className="form-group"><label className="form-label">Order</label><input type="number" className="form-input" value={formData.display_order} onChange={(e) => setFormData(p => ({ ...p, display_order: parseInt(e.target.value) }))} /></div>
                            </div>
                            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button><button type="submit" className="btn btn-primary"><Save size={16} /> Save</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
