import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useProjectProgress, useSettings, useProjects } from '../../hooks/useData';
import './Progress.css';

export default function Progress() {
    const { milestones, statusData, loading: progressLoading } = useProjectProgress();
    const { settings } = useSettings();
    const { projects, loading: projectsLoading } = useProjects();
    const loading = progressLoading || projectsLoading;

    // Manual stats from the Progress tab
    const overallStat = statusData.find(s => s.category === 'overall') || { percentage: 0 };
    const manualStats = statusData.filter(s => s.category !== 'overall');

    // Dynamic stats from the Projects tab (only construction status)
    const projectStats = projects
        .filter(p => p.status === 'construction')
        .map(p => ({
            id: `proj-${p.id}`,
            label: p.title,
            percentage: p.completion_percentage || 0
        }));

    // Combine stats (Manual + Projects)
    const otherStats = [...manualStats, ...projectStats];

    useEffect(() => {
        AOS.init({ duration: 800, once: true, offset: 100 });
    }, []);

    const statusIcons = {
        completed: <CheckCircle size={20} />,
        'in-progress': <Clock size={20} />,
        pending: <AlertCircle size={20} />
    };

    const statusColors = {
        completed: '#10b981',
        'in-progress': '#f59e0b',
        pending: '#6b7280'
    };



    if (loading) {
        return (
            <div className="progress-loading" style={{ padding: '100px', textAlign: 'center' }}>
                <div className="loading-spinner"></div>
                <p>Loading progress...</p>
            </div>
        );
    }

    return (
        <main className="progress-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-bg" style={{
                    backgroundImage: `url(${settings?.progress_hero_image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920'})`
                }}></div>
                <div className="page-hero-overlay"></div>
                <div className="container">
                    <div className="page-hero-content" data-aos="fade-up">
                        <span className="page-hero-subtitle">Development</span>
                        <h1 className="page-hero-title">Project Progress</h1>
                        <p className="page-hero-description">
                            Track our journey from inception to completion
                        </p>
                    </div>
                </div>
            </section>

            {/* Progress Overview */}
            <section className="section">
                <div className="container">
                    <div className="progress-stats" data-aos="fade-up">
                        <div className="progress-stat main-stat">
                            <div className="progress-stat-value">{overallStat.percentage}%</div>
                            <div className="progress-stat-label">Overall Progress</div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${overallStat.percentage}%` }}></div>
                            </div>
                        </div>

                        {otherStats.length > 0 && (
                            <div className="progress-grid">
                                {otherStats.map((stat) => (
                                    <div key={stat.id} className="progress-stat small-stat">
                                        <div className="progress-stat-header">
                                            <span className="progress-stat-label">{stat.label}</span>
                                            <span className="progress-stat-value-small">{stat.percentage}%</span>
                                        </div>
                                        <div className="progress-bar small">
                                            <div className="progress-fill" style={{ width: `${stat.percentage}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="section section-gray">
                <div className="container">
                    <div className="section-header" data-aos="fade-up">
                        <span className="section-subtitle">Timeline</span>
                        <h2 className="section-title">Project Milestones</h2>
                    </div>

                    <div className="timeline">
                        {milestones.map((milestone, index) => (
                            <div
                                key={milestone.id}
                                className="timeline-item"
                                data-aos="fade-up"
                                data-aos-delay={index * 50}
                            >
                                <div
                                    className="timeline-marker"
                                    style={{ backgroundColor: statusColors[milestone.status] || '#6b7280' }}
                                >
                                    {statusIcons[milestone.status] || <AlertCircle size={20} />}
                                </div>
                                <div className="timeline-content">
                                    <span className="timeline-date">{milestone.date}</span>
                                    <h3 className="timeline-title">{milestone.title}</h3>
                                    <span
                                        className="timeline-status"
                                        style={{ color: statusColors[milestone.status] || '#6b7280' }}
                                    >
                                        {milestone.status.replace('-', ' ')}
                                        {milestone.status === 'in-progress' && milestone.percentage ? ` (${milestone.percentage}%)` : ''}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


        </main>
    );
}
