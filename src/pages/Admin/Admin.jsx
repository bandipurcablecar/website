import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
    LayoutDashboard,
    Settings,
    FolderKanban,
    Users,
    Building2,
    HeartHandshake,
    Megaphone,
    Image,
    Mail,
    LogOut,
    Menu,
    X,
    FileText,
    Mountain,
    Files,
    TrendingUp,
    Activity,
    Award
} from 'lucide-react';
import { useSettings } from '../../hooks/useData';
import AdminDashboard from './AdminDashboard';
import AdminHome from './AdminHome';
import AdminSettings from './AdminSettings';
import AdminDownloads from './AdminDownloads';
import AdminProjects from './AdminProjects';
import AdminPages from './AdminPages';
import AdminGallery from './AdminGallery';
import AdminTeam from './AdminTeam';
import AdminAssociates from './AdminAssociates';
import AdminSupporters from './AdminSupporters';
import AdminAnnouncements from './AdminAnnouncements';
import AdminProgress from './AdminProgress';
import AdminInquiries from './AdminInquiries';
import AdminAttractions from './AdminAttractions';
import AdminLogin from './AdminLogin';
import AdminShareholders from './AdminShareholders';
import AdminAwards from './AdminAwards';
import './Admin.css';

export default function Admin() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const { settings } = useSettings();

    useEffect(() => {
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    async function checkUser() {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        setLoading(false);
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        setUser(null);
    }

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Image, label: 'Home Page', path: '/admin/home' },
        { icon: Settings, label: 'Site Settings', path: '/admin/settings' },
        { icon: Files, label: 'Custom Pages', path: '/admin/pages' },
        { icon: Mountain, label: 'Attractions', path: '/admin/attractions' },
        { icon: Activity, label: 'Progress', path: '/admin/progress' },
        { icon: Image, label: 'Gallery', path: '/admin/gallery' },
        { icon: FileText, label: 'Downloads', path: '/admin/downloads' },
        { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
        { icon: Users, label: 'Team Members', path: '/admin/team' },
        { icon: Building2, label: 'Associates', path: '/admin/associates' },
        { icon: Users, label: 'Basic Shareholders', path: '/admin/basic-shareholders' },
        { icon: Award, label: 'Awards', path: '/admin/awards' },
        { icon: HeartHandshake, label: 'Supporters', path: '/admin/supporters' },
        { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
        { icon: Mail, label: 'Inquiries', path: '/admin/inquiries' },
    ];

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <AdminLogin onLogin={setUser} />;
    }

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        {settings?.logo_url ? (
                            settings.logo_url.toLowerCase().endsWith('.mp4') ? (
                                <video
                                    src={settings.logo_url}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    style={{ height: '50px', width: 'auto', borderRadius: '4px', objectFit: 'contain', backgroundColor: 'white' }}
                                />
                            ) : (
                                <img
                                    src={settings.logo_url}
                                    alt="Logo"
                                    style={{ height: '50px', width: 'auto', objectFit: 'contain', backgroundColor: 'white' }}
                                />
                            )
                        ) : (
                            <Mountain size={28} />
                        )}
                        <span>Bandipur Admin</span>
                    </div>
                    <button
                        className="sidebar-close"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="user-avatar">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                            <span className="user-email">{user.email}</span>
                            <span className="user-role">Administrator</span>
                        </div>
                    </div>
                    <button className="sidebar-logout" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="admin-main">
                {/* Top Bar */}
                <header className="admin-topbar">
                    <button
                        className="topbar-menu"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <div className="topbar-breadcrumb">
                        <Link to="/" className="breadcrumb-home">View Website</Link>
                    </div>
                </header>

                {/* Content */}
                <div className="admin-content">
                    <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/home" element={<AdminHome />} />
                        <Route path="/settings" element={<AdminSettings />} />
                        <Route path="/pages" element={<AdminPages />} />
                        <Route path="/downloads" element={<AdminDownloads />} />
                        <Route path="/projects" element={<AdminProjects />} />
                        <Route path="/team" element={<AdminTeam />} />
                        <Route path="/associates" element={<AdminAssociates />} />
                        <Route path="/supporters" element={<AdminSupporters />} />
                        <Route path="/announcements" element={<AdminAnnouncements />} />
                        <Route path="/progress" element={<AdminProgress />} />
                        <Route path="/inquiries" element={<AdminInquiries />} />
                        <Route path="/attractions" element={<AdminAttractions />} />
                        <Route path="/gallery" element={<AdminGallery />} />
                        <Route path="/basic-shareholders" element={<AdminShareholders />} />
                        <Route path="/awards" element={<AdminAwards />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}
