import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, X, Save, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminAssociates() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        logo_url: '',
        website_url: '',
        display_order: 0,
        is_active: true,
        isFileUpload: false,
        logoFile: null
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    async function fetchCompanies() {
        try {
            const { data, error } = await supabase
                .from('associate_companies')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setCompanies(data || []);
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setLoading(false);
        }
    }

    function openModal(company = null) {
        if (company) {
            setEditingCompany(company);
            setFormData({
                name: company.name,
                logo_url: company.logo_url || '',
                website_url: company.website_url || '',
                display_order: company.display_order || 0,
                is_active: company.is_active,
                isFileUpload: false,
                logoFile: null
            });
        } else {
            setEditingCompany(null);
            setFormData({
                name: '',
                logo_url: '',
                website_url: '',
                display_order: companies.length,
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
                const fileName = `associate-logos/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

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
                logo_url: finalLogoUrl,
                website_url: formData.website_url,
                display_order: formData.display_order,
                is_active: formData.is_active
            };

            if (editingCompany) {
                const { error } = await supabase.from('associate_companies').update(submissionData).eq('id', editingCompany.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('associate_companies').insert([submissionData]);
                if (error) throw error;
            }
            fetchCompanies();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving company:', error);
            alert('Failed to save company: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    async function toggleActive(company) {
        try {
            const { error } = await supabase
                .from('associate_companies')
                .update({ is_active: !company.is_active })
                .eq('id', company.id);
            if (error) throw error;
            fetchCompanies();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this company?')) return;
        try {
            const { error } = await supabase.from('associate_companies').delete().eq('id', id);
            if (error) throw error;
            fetchCompanies();
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    }

    return (
        <div className="admin-associates">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Associate Companies</h1>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} /> Add Company
                </button>
            </div>

            <div className="admin-card">
                {loading ? (
                    <div className="empty-state"><div className="loading-spinner"></div></div>
                ) : companies.length === 0 ? (
                    <div className="empty-state"><h3>No Companies Yet</h3></div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Website</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map((company) => (
                                <tr key={company.id}>
                                    <td><strong>{company.name}</strong></td>
                                    <td>{company.website_url ? <a href={company.website_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>{company.website_url}</a> : '-'}</td>
                                    <td>
                                        <button onClick={() => toggleActive(company)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                            {company.is_active ? <ToggleRight size={24} color="var(--color-success)" /> : <ToggleLeft size={24} color="var(--color-gray-400)" />}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="table-action" onClick={() => openModal(company)}><Pencil size={16} /></button>
                                            <button className="table-action delete" onClick={() => handleDelete(company.id)}><Trash2 size={16} /></button>
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
                            <h3 className="modal-title">{editingCompany ? 'Edit Company' : 'Add Company'}</h3>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Company Name</label>
                                    <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
                                </div>

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

                                <div className="form-group">
                                    <label className="form-label">Website URL</label>
                                    <input type="url" className="form-input" value={formData.website_url} onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Display Order</label>
                                    <input type="number" className="form-input" value={formData.display_order} onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Saving...' : <><Save size={16} /> Save</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
