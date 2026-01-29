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
        is_active: true
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
                is_active: company.is_active
            });
        } else {
            setEditingCompany(null);
            setFormData({
                name: '',
                logo_url: '',
                website_url: '',
                display_order: companies.length,
                is_active: true
            });
        }
        setIsModalOpen(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (editingCompany) {
                const { error } = await supabase.from('associate_companies').update(formData).eq('id', editingCompany.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('associate_companies').insert([formData]);
                if (error) throw error;
            }
            fetchCompanies();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving company:', error);
            alert('Failed to save company');
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
                                    <label className="form-label">Logo URL</label>
                                    <input type="url" className="form-input" value={formData.logo_url} onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))} />
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
                                <button type="submit" className="btn btn-primary"><Save size={16} /> Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
