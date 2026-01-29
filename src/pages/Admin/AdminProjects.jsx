import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, X, Save, Upload } from 'lucide-react';

export default function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        image_url: '',
        status: 'operational'
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    }

    function openModal(project = null) {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                slug: project.slug,
                description: project.description || '',
                image_url: project.image_url || '',
                status: project.status || 'operational',
                completion_percentage: project.completion_percentage || 0
            });
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                slug: '',
                description: '',
                image_url: '',
                status: 'operational',
                completion_percentage: 0
            });
        }
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setEditingProject(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (editingProject) {
                const { error } = await supabase
                    .from('projects')
                    .update(formData)
                    .eq('id', editingProject.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('projects')
                    .insert([formData]);
                if (error) throw error;
            }

            fetchProjects();
            closeModal();
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Failed to save project');
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
        }
    }

    function generateSlug(title) {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    async function handleImageUpload(e) {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `projects/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

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
        <div className="admin-projects">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Projects</h1>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <Plus size={18} />
                    Add Project
                </button>
            </div>

            <div className="admin-card">
                {loading ? (
                    <div className="empty-state">
                        <div className="loading-spinner"></div>
                        <p>Loading projects...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Projects Yet</h3>
                        <p>Click "Add Project" to create your first project.</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id}>
                                    <td>
                                        <img
                                            src={project.image_url || 'https://via.placeholder.com/60x40'}
                                            alt={project.title}
                                            style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                        />
                                    </td>
                                    <td>
                                        <strong>{project.title}</strong>
                                        <br />
                                        <small style={{ color: 'var(--color-gray-500)' }}>{project.slug}</small>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${project.status === 'operational' ? 'active' : project.status === 'construction' ? 'pending' : 'inactive'}`}>
                                            {project.status}
                                            {project.status === 'construction' && project.completion_percentage ? ` (${project.completion_percentage}%)` : ''}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                className="table-action"
                                                onClick={() => openModal(project)}
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                className="table-action delete"
                                                onClick={() => handleDelete(project.id)}
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
                                {editingProject ? 'Edit Project' : 'Add Project'}
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
                                        onChange={(e) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                title: e.target.value,
                                                slug: editingProject ? prev.slug : generateSlug(e.target.value)
                                            }));
                                        }}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Slug</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.slug}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={4}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Project Image</label>

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
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        value={formData.status}
                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                    >
                                        <option value="planning">Planning</option>
                                        <option value="construction">Construction</option>
                                        <option value="operational">Operational</option>
                                    </select>
                                </div>
                                {formData.status === 'construction' && (
                                    <div className="form-group">
                                        <label className="form-label">Completion Percentage (%)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            min="0"
                                            max="100"
                                            value={formData.completion_percentage || 0}
                                            onChange={(e) => setFormData(prev => ({ ...prev, completion_percentage: parseInt(e.target.value) }))}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={uploading}>
                                    <Save size={16} />
                                    {editingProject ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
