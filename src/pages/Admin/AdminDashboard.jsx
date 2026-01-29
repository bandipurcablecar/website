import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FolderKanban, Users, Building2, HeartHandshake, Mail, Megaphone, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        projects: 0,
        team: 0,
        associates: 0,
        supporters: 0,
        inquiries: 0,
        announcements: 0
    });
    const [recentInquiries, setRecentInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        fetchRecentInquiries();
    }, []);

    async function fetchStats() {
        try {
            const [
                { count: projects },
                { count: team },
                { count: associates },
                { count: supporters },
                { count: inquiries },
                { count: announcements }
            ] = await Promise.all([
                supabase.from('projects').select('*', { count: 'exact', head: true }),
                supabase.from('team_members').select('*', { count: 'exact', head: true }),
                supabase.from('associate_companies').select('*', { count: 'exact', head: true }),
                supabase.from('supporters').select('*', { count: 'exact', head: true }),
                supabase.from('inquiries').select('*', { count: 'exact', head: true }),
                supabase.from('announcements').select('*', { count: 'exact', head: true })
            ]);

            setStats({
                projects: projects || 0,
                team: team || 0,
                associates: associates || 0,
                supporters: supporters || 0,
                inquiries: inquiries || 0,
                announcements: announcements || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }

    async function fetchRecentInquiries() {
        try {
            const { data, error } = await supabase
                .from('inquiries')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            setRecentInquiries(data || []);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    }

    const statCards = [
        { icon: FolderKanban, label: 'Projects', value: stats.projects, color: 'primary', link: '/admin/projects' },
        { icon: Users, label: 'Team Members', value: stats.team, color: 'accent', link: '/admin/team' },
        { icon: Building2, label: 'Associates', value: stats.associates, color: 'success', link: '/admin/associates' },
        { icon: HeartHandshake, label: 'Supporters', value: stats.supporters, color: 'info', link: '/admin/supporters' },
        { icon: Mail, label: 'Inquiries', value: stats.inquiries, color: 'warning', link: '/admin/inquiries' },
        { icon: Megaphone, label: 'Announcements', value: stats.announcements, color: 'error', link: '/admin/announcements' },
    ];

    return (
        <div className="admin-dashboard">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Dashboard</h1>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {statCards.map((stat, index) => (
                    <Link to={stat.link} key={index} className="stat-card-admin" style={{ textDecoration: 'none' }}>
                        <div className="stat-icon">
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Inquiries */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <h2 className="admin-card-title">Recent Inquiries</h2>
                    <Link to="/admin/inquiries" className="btn btn-primary" style={{ fontSize: 'var(--text-sm)' }}>
                        View All
                    </Link>
                </div>

                {loading ? (
                    <div className="empty-state">
                        <div className="loading-spinner"></div>
                        <p>Loading...</p>
                    </div>
                ) : recentInquiries.length === 0 ? (
                    <div className="empty-state">
                        <Mail />
                        <h3>No Inquiries Yet</h3>
                        <p>When visitors send messages, they'll appear here.</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentInquiries.map((inquiry) => (
                                <tr key={inquiry.id}>
                                    <td>{inquiry.name}</td>
                                    <td>{inquiry.email}</td>
                                    <td>
                                        <span className={`status-badge status-${inquiry.status === 'new' ? 'pending' : 'active'}`}>
                                            {inquiry.status}
                                        </span>
                                    </td>
                                    <td>{new Date(inquiry.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
