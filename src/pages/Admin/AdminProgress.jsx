import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, Save, X, Activity } from 'lucide-react';

export default function AdminProgress() {
    const [milestones, setMilestones] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('milestones');

    // Milestone Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState(null);
    const [milestoneForm, setMilestoneForm] = useState({
        title: '',
        date: '',
        status: 'pending',
        percentage: 0,
        display_order: 0
    });

    // Status Form State
    const [statusForm, setStatusForm] = useState({});
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    // ... (fetchData is fine)

    // ... (Milestone functions are fine)

    // ... (handleStatusUpdate is fine)

    async function handleAddCategory(e) {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        const category = newCategoryName.trim().toLowerCase().replace(/\s+/g, '_');

        try {
            const { error } = await supabase.from('project_status').insert([{
                category,
                label: newCategoryName,
                percentage: 0
            }]);

            if (error) throw error;

            setNewCategoryName('');
            fetchData();
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Failed to add category. It might already exist.');
        }
    }

    async function handleDeleteCategory(id) {
        if (!confirm("Delete this category?")) return;
        try {
            await supabase.from('project_status').delete().eq('id', id);
            fetchData();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }

    async function fetchData() {
        setLoading(true);
        try {
            const [milestonesRes, statusRes] = await Promise.all([
                supabase.from('project_milestones').select('*').order('display_order', { ascending: true }),
                supabase.from('project_status').select('*')
            ]);

            setMilestones(milestonesRes.data || []);
            setStatusData(statusRes.data || []);

            // Initialize status form
            const sForm = {};
            (statusRes.data || []).forEach(item => {
                sForm[item.category] = item.percentage;
            });
            setStatusForm(sForm);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    // --- Milestone Functions ---
    function openModal(milestone = null) {
        if (milestone) {
            setEditingMilestone(milestone);
            setMilestoneForm({
                title: milestone.title,
                date: milestone.date,
                status: milestone.status,
                percentage: milestone.percentage || 0,
                display_order: milestone.display_order
            });
        } else {
            setEditingMilestone(null);
            setMilestoneForm({
                title: '',
                date: '',
                status: 'pending',
                percentage: 0,
                display_order: milestones.length + 1
            });
        }
        setIsModalOpen(true);
    }

    async function handleMilestoneSubmit(e) {
        e.preventDefault();
        try {
            if (editingMilestone) {
                await supabase.from('project_milestones').update(milestoneForm).eq('id', editingMilestone.id);
            } else {
                await supabase.from('project_milestones').insert([milestoneForm]);
            }
            fetchData();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving milestone:', error);
        }
    }

    async function handleMilestoneDelete(id) {
        if (!confirm("Are you sure?")) return;
        await supabase.from('project_milestones').delete().eq('id', id);
        fetchData();
    }

    // --- Status Functions ---
    async function handleStatusUpdate(e) {
        e.preventDefault();
        try {
            for (const category of Object.keys(statusForm)) {
                await supabase
                    .from('project_status')
                    .update({ percentage: statusForm[category], updated_at: new Date() })
                    .eq('category', category);
            }
            alert('Percentages updated successfully!');
            fetchData();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }

    async function handleOrderUpdate(id, newOrder) {
        try {
            await supabase.from('project_milestones').update({ display_order: newOrder }).eq('id', id);
            fetchData();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    }

    return (
        <div className="admin-progress">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Project Progress</h1>
                <div className="admin-tabs">
                    <button
                        className={`admin-tab ${activeTab === 'milestones' ? 'active' : ''}`}
                        onClick={() => setActiveTab('milestones')}
                    >
                        Milestones Timeline
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'status' ? 'active' : ''}`}
                        onClick={() => setActiveTab('status')}
                    >
                        Progress Percentages
                    </button>
                </div>
            </div>

            {activeTab === 'milestones' ? (
                <div className="admin-card">
                    <div className="flex justify-between items-center mb-6">
                        <h3>Timeline Events</h3>
                        <button className="btn btn-primary" onClick={() => openModal()}>
                            <Plus size={18} /> Add Milestone
                        </button>
                    </div>

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>Order</th>
                                <th>Date</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {milestones.map((m) => (
                                <tr key={m.id}>
                                    <td>
                                        <input
                                            type="number"
                                            className="form-input"
                                            style={{ width: '60px', padding: '4px 8px' }}
                                            defaultValue={m.display_order}
                                            onBlur={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (val !== m.display_order) handleOrderUpdate(m.id, val);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.target.blur();
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>{m.date}</td>
                                    <td><strong>{m.title}</strong></td>
                                    <td>
                                        <span className={`status-badge status-${m.status === 'in-progress' ? 'active' : m.status === 'completed' ? 'active' : 'pending'}`}
                                            style={{ backgroundColor: m.status === 'completed' ? '#dcfce7' : m.status === 'in-progress' ? '#fef9c3' : '#f3f4f6', color: m.status === 'completed' ? '#166534' : m.status === 'in-progress' ? '#854d0e' : '#374151' }}>
                                            {m.status} {m.status === 'in-progress' && m.percentage ? `(${m.percentage}%)` : ''}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="table-action" onClick={() => openModal(m)}><Pencil size={16} /></button>
                                            <button className="table-action delete" onClick={() => handleMilestoneDelete(m.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="admin-card">
                    <h3>Update Progress Percentages</h3>
                    <form onSubmit={handleStatusUpdate} className="mt-6">
                        <div className="grid grid-cols-2 gap-6">
                            {statusData.map((item) => (
                                <div key={item.id} className="form-group">
                                    <label className="form-label flex justify-between items-center">
                                        {item.label}
                                        {item.category !== 'overall' && (
                                            <button type="button" className="text-red-500 hover:text-red-700 p-1" onClick={() => handleDeleteCategory(item.id)} title="Delete Category">
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            value={statusForm[item.category] || 0}
                                            onChange={(e) => setStatusForm(prev => ({ ...prev, [item.category]: parseInt(e.target.value) }))}
                                        />
                                        <span className="font-bold text-lg w-12">{statusForm[item.category] || 0}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h4 className="font-semibold mb-4" style={{ fontSize: '0.9rem', color: '#6b7280' }}>Add New Category</h4>
                            <div className="flex gap-4 items-end">
                                <div style={{ flex: 1 }}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Category Name (e.g. Water Supply)"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                    />
                                </div>
                                <button type="button" className="btn btn-secondary" onClick={handleAddCategory}>
                                    <Plus size={18} /> Add
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button type="submit" className="btn btn-primary">
                                <Save size={18} /> Save All Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Milestone Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editingMilestone ? 'Edit Milestone' : 'Add Milestone'}</h3>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleMilestoneSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Title</label>
                                    <input type="text" className="form-input" required
                                        value={milestoneForm.title} onChange={e => setMilestoneForm({ ...milestoneForm, title: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date (Display Text)</label>
                                    <input type="text" className="form-input" required placeholder="e.g. 2080 BS or 2024"
                                        value={milestoneForm.date} onChange={e => setMilestoneForm({ ...milestoneForm, date: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select className="form-select" value={milestoneForm.status} onChange={e => setMilestoneForm({ ...milestoneForm, status: e.target.value })}>
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                {milestoneForm.status === 'in-progress' && (
                                    <div className="form-group">
                                        <label className="form-label">Percentage Completed (%)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            min="0"
                                            max="100"
                                            value={milestoneForm.percentage || 0}
                                            onChange={e => setMilestoneForm({ ...milestoneForm, percentage: parseInt(e.target.value) })}
                                        />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label className="form-label">Display Order</label>
                                    <input type="number" className="form-input" required
                                        value={milestoneForm.display_order} onChange={e => setMilestoneForm({ ...milestoneForm, display_order: parseInt(e.target.value) })} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
