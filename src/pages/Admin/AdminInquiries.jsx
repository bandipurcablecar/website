import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Eye, Trash2, Mail, CheckCircle, Clock } from 'lucide-react';

export default function AdminInquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    useEffect(() => { fetchData(); }, []);

    async function fetchData() {
        try {
            const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setInquiries(data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id, status) {
        await supabase.from('inquiries').update({ status }).eq('id', id);
        fetchData();
    }

    async function handleDelete(id) {
        if (!confirm('Delete this inquiry?')) return;
        await supabase.from('inquiries').delete().eq('id', id);
        fetchData();
        setSelectedInquiry(null);
    }

    return (
        <div className="admin-inquiries">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Inquiries</h1>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                    <span className="status-badge status-pending">{inquiries.filter(i => i.status === 'new').length} New</span>
                    <span className="status-badge status-active">{inquiries.filter(i => i.status === 'resolved').length} Resolved</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedInquiry ? '1fr 1fr' : '1fr', gap: 'var(--spacing-6)' }}>
                <div className="admin-card">
                    {loading ? <div className="empty-state"><div className="loading-spinner"></div></div> : inquiries.length === 0 ? (
                        <div className="empty-state"><Mail size={48} /><h3>No Inquiries Yet</h3><p>Messages from visitors will appear here.</p></div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                            {inquiries.map((inquiry) => (
                                <div
                                    key={inquiry.id}
                                    onClick={() => setSelectedInquiry(inquiry)}
                                    style={{
                                        padding: 'var(--spacing-4)',
                                        borderRadius: 'var(--radius-lg)',
                                        border: selectedInquiry?.id === inquiry.id ? '2px solid var(--color-accent)' : '1px solid var(--color-gray-100)',
                                        cursor: 'pointer',
                                        background: inquiry.status === 'new' ? 'var(--color-gray-50)' : 'white',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
                                        <strong>{inquiry.name}</strong>
                                        <span className={`status-badge status-${inquiry.status === 'new' ? 'pending' : 'active'}`}>{inquiry.status}</span>
                                    </div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>{inquiry.email}</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', marginTop: 'var(--spacing-2)' }}>
                                        {new Date(inquiry.created_at).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedInquiry && (
                    <div className="admin-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-6)' }}>
                            <div>
                                <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--spacing-1)' }}>{selectedInquiry.name}</h2>
                                <a href={`mailto:${selectedInquiry.email}`} style={{ color: 'var(--color-accent)' }}>{selectedInquiry.email}</a>
                                {selectedInquiry.phone && <div style={{ marginTop: 'var(--spacing-1)', color: 'var(--color-gray-600)' }}>{selectedInquiry.phone}</div>}
                            </div>
                            <button className="table-action delete" onClick={() => handleDelete(selectedInquiry.id)}><Trash2 size={18} /></button>
                        </div>

                        <div style={{ background: 'var(--color-gray-50)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--spacing-6)' }}>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{selectedInquiry.message || 'No message'}</p>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                            {selectedInquiry.status === 'new' && (
                                <button className="btn btn-primary" onClick={() => updateStatus(selectedInquiry.id, 'resolved')}>
                                    <CheckCircle size={16} /> Mark Resolved
                                </button>
                            )}
                            {selectedInquiry.status === 'resolved' && (
                                <button className="btn btn-secondary" onClick={() => updateStatus(selectedInquiry.id, 'new')}>
                                    <Clock size={16} /> Mark as New
                                </button>
                            )}
                            <a href={`mailto:${selectedInquiry.email}`} className="btn btn-secondary"><Mail size={16} /> Reply via Email</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
