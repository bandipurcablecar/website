import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

export default function AdminTeam() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        bio: '',
        image_url: '',
        display_order: 0,
        type: 'board'
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    async function fetchMembers() {
        try {
            const { data, error } = await supabase
                .from('team_members')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setMembers(data || []);
        } catch (error) {
            console.error('Error fetching team members:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleImageUpload(e) {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `team-photos/${fileName}`;

            // Use 'documents' bucket or check if 'images' exists. 
            // Defaulting to 'documents' as we know it works from AdminDownloads.
            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    }

    function openModal(member = null) {
        if (member) {
            setEditingMember(member);
            setFormData({
                name: member.name,
                position: member.position,
                bio: member.bio || '',
                image_url: member.image_url || '',
                display_order: member.display_order || 0,
                type: member.type || 'board'
            });
        } else {
            setEditingMember(null);
            setFormData({
                name: '',
                position: '',
                bio: '',
                image_url: '',
                display_order: members.length + 1,
                type: 'board'
            });
        }
        setIsModalOpen(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (editingMember) {
                const { error } = await supabase
                    .from('team_members')
                    .update(formData)
                    .eq('id', editingMember.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('team_members')
                    .insert([formData]);
                if (error) throw error;
            }

            fetchMembers();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving team member:', error);
            alert('Failed to save team member');
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this team member?')) return;

        try {
            const { error } = await supabase
                .from('team_members')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchMembers();
        } catch (error) {
            console.error('Error deleting team member:', error);
        }
    }

    return (
        <div className="admin-team">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Team Members</h1>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} />
                    Add Member
                </button>
            </div>

            <div className="admin-card">
                {loading ? (
                    <div className="empty-state">
                        <div className="loading-spinner"></div>
                    </div>
                ) : members.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Team Members Yet</h3>
                        <p>Click "Add Member" to add team members.</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Order</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id}>
                                    <td>
                                        {member.image_url ? (
                                            <img
                                                src={member.image_url}
                                                alt={member.name}
                                                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: 50, height: 50, borderRadius: '50%',
                                                background: 'var(--color-gray-200)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 'bold', color: 'var(--color-gray-600)'
                                            }}>
                                                {member.name.charAt(0)}
                                            </div>
                                        )}
                                    </td>
                                    <td><strong>{member.name}</strong></td>
                                    <td>{member.position}</td>
                                    <td>{member.display_order}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="table-action" onClick={() => openModal(member)}>
                                                <Pencil size={16} />
                                            </button>
                                            <button className="table-action delete" onClick={() => handleDelete(member.id)}>
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
                            <h3 className="modal-title">{editingMember ? 'Edit Member' : 'Add Member'}</h3>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Position</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.position}
                                        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Type</label>
                                    <select
                                        className="form-input"
                                        value={formData.type}
                                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                    >
                                        <option value="board">Board of Directors</option>
                                        <option value="management">Management Team</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bio</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.bio}
                                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                        rows={4}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Photo</label>
                                    {formData.image_url && (
                                        <div className="mb-2">
                                            <img src={formData.image_url} alt="Preview" style={{ height: 100, borderRadius: 8 }} />
                                            <button
                                                type="button"
                                                className="btn btn-outline btn-sm mt-2 block"
                                                onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                            >
                                                Remove Photo
                                            </button>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        className="form-input"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <input
                                        type="text"
                                        className="form-input mt-2"
                                        placeholder="Or paste image URL..."
                                        value={formData.image_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Display Order</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.display_order}
                                        onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
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
                </div>
            )}
        </div>
    );
}
