import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

export default function AdminIPO() {
    const [capitalStructure, setCapitalStructure] = useState([]);
    const [publicOffering, setPublicOffering] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('capital');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [currentTable, setCurrentTable] = useState('capital');
    const [formData, setFormData] = useState({
        sn: '',
        description: '',
        share_count: '',
        amount: '',
        percentage: '',
        remarks: '',
        display_order: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [capitalRes, publicRes] = await Promise.all([
                supabase
                    .from('ipo_capital_structure')
                    .select('*')
                    .order('display_order', { ascending: true }),
                supabase
                    .from('ipo_public_offering')
                    .select('*')
                    .order('display_order', { ascending: true })
            ]);

            if (capitalRes.data) setCapitalStructure(capitalRes.data);
            if (publicRes.data) setPublicOffering(publicRes.data);
        } catch (error) {
            console.error('Error fetching IPO data:', error);
        } finally {
            setLoading(false);
        }
    }

    function openModal(table, item = null) {
        setCurrentTable(table);
        if (item) {
            setEditingItem(item);
            setFormData({
                sn: item.sn,
                description: item.description,
                share_count: item.share_count,
                amount: item.amount,
                percentage: item.percentage,
                remarks: item.remarks || '',
                display_order: item.display_order || 0
            });
        } else {
            setEditingItem(null);
            setFormData({
                sn: '',
                description: '',
                share_count: '',
                amount: '',
                percentage: '',
                remarks: '',
                display_order: 0
            });
        }
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setEditingItem(null);
        setFormData({
            sn: '',
            description: '',
            share_count: '',
            amount: '',
            percentage: '',
            remarks: '',
            display_order: 0
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const tableName = currentTable === 'capital' ? 'ipo_capital_structure' : 'ipo_public_offering';

        try {
            if (editingItem) {
                const { error } = await supabase
                    .from(tableName)
                    .update({
                        sn: currentTable === 'capital' ? parseInt(formData.sn) || 0 : formData.sn,
                        description: formData.description,
                        share_count: parseInt(formData.share_count),
                        amount: parseFloat(formData.amount),
                        percentage: parseFloat(formData.percentage),
                        remarks: formData.remarks,
                        display_order: parseInt(formData.display_order)
                    })
                    .eq('id', editingItem.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from(tableName)
                    .insert([{
                        sn: currentTable === 'capital' ? parseInt(formData.sn) || 0 : formData.sn,
                        description: formData.description,
                        share_count: parseInt(formData.share_count),
                        amount: parseFloat(formData.amount),
                        percentage: parseFloat(formData.percentage),
                        remarks: formData.remarks,
                        display_order: parseInt(formData.display_order)
                    }]);

                if (error) throw error;
            }

            closeModal();
            fetchData();
            alert(editingItem ? 'Updated successfully!' : 'Added successfully!');
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save: ' + error.message);
        }
    }

    async function handleDelete(table, id) {
        if (!confirm('Are you sure you want to delete this entry?')) return;

        const tableName = table === 'capital' ? 'ipo_capital_structure' : 'ipo_public_offering';

        try {
            const { error } = await supabase
                .from(tableName)
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchData();
            alert('Deleted successfully!');
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Failed to delete');
        }
    }

    if (loading) {
        return <div className="admin-page"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">IPO Management</h1>
                    <p className="admin-page-subtitle">Manage IPO capital structure and public offering details</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'capital' ? 'active' : ''}`}
                    onClick={() => setActiveTab('capital')}
                >
                    Capital Structure (निष्कासन पछिको चुक्ता पूँजी)
                </button>
                <button
                    className={`admin-tab ${activeTab === 'public' ? 'active' : ''}`}
                    onClick={() => setActiveTab('public')}
                >
                    Public Offering (सर्वसाधरणमा निष्कासन)
                </button>
            </div>

            {/* Capital Structure Tab */}
            {activeTab === 'capital' && (
                <div className="tab-content">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Capital Structure Entries</h3>
                        <button className="btn btn-primary" onClick={() => openModal('capital')}>
                            <Plus size={18} /> Add Entry
                        </button>
                    </div>

                    <div className="admin-card">
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>Description</th>
                                        <th>Share Count</th>
                                        <th>Amount</th>
                                        <th>%</th>
                                        <th>Remarks</th>
                                        <th>Order</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {capitalStructure.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.sn || 'Total'}</td>
                                            <td>{item.description}</td>
                                            <td>{item.share_count.toLocaleString()}</td>
                                            <td>{item.amount.toLocaleString()}</td>
                                            <td>{item.percentage}%</td>
                                            <td>{item.remarks}</td>
                                            <td>{item.display_order}</td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="btn-icon"
                                                        onClick={() => openModal('capital', item)}
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        className="btn-icon text-red-500"
                                                        onClick={() => handleDelete('capital', item.id)}
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
                    </div>
                </div>
            )}

            {/* Public Offering Tab */}
            {activeTab === 'public' && (
                <div className="tab-content">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Public Offering Entries</h3>
                        <button className="btn btn-primary" onClick={() => openModal('public')}>
                            <Plus size={18} /> Add Entry
                        </button>
                    </div>

                    <div className="admin-card">
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>Description</th>
                                        <th>Share Count</th>
                                        <th>Amount</th>
                                        <th>%</th>
                                        <th>Remarks</th>
                                        <th>Order</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {publicOffering.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.sn}</td>
                                            <td>{item.description}</td>
                                            <td>{item.share_count.toLocaleString()}</td>
                                            <td>{item.amount.toLocaleString()}</td>
                                            <td>{item.percentage}%</td>
                                            <td>{item.remarks}</td>
                                            <td>{item.display_order}</td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="btn-icon"
                                                        onClick={() => openModal('public', item)}
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        className="btn-icon text-red-500"
                                                        onClick={() => handleDelete('public', item.id)}
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
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingItem ? 'Edit Entry' : 'Add Entry'}</h3>
                            <button onClick={closeModal}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Serial Number (क्र.सं.)</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.sn}
                                            onChange={e => setFormData({ ...formData, sn: e.target.value })}
                                            placeholder={currentTable === 'capital' ? "Number or 'जम्मा'" : "e.g., २.१"}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Display Order</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.display_order}
                                            onChange={e => setFormData({ ...formData, display_order: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description (विवरण)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Share Count (शेयर संख्या)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.share_count}
                                            onChange={e => setFormData({ ...formData, share_count: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Amount (रु.)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-input"
                                            value={formData.amount}
                                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Percentage (%)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-input"
                                            value={formData.percentage}
                                            onChange={e => setFormData({ ...formData, percentage: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Remarks (शुभकामनी विवरण)</label>
                                    <textarea
                                        className="form-textarea"
                                        rows={3}
                                        value={formData.remarks}
                                        onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <Save size={18} /> Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
