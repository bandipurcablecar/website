import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAnnouncements } from '../../hooks/useData';
import { Calendar, ExternalLink, Megaphone } from 'lucide-react';
import './Media.css';

export default function Media() {
    const { announcements, loading } = useAnnouncements();

    useEffect(() => {
        AOS.init({ duration: 800, once: true, offset: 100 });
    }, []);

    return (
        <main className="media-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-bg" style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920)`
                }}></div>
                <div className="page-hero-overlay"></div>
                <div className="container">
                    <div className="page-hero-content" data-aos="fade-up">
                        <span className="page-hero-subtitle">Stay Updated</span>
                        <h1 className="page-hero-title">News & Media</h1>
                        <p className="page-hero-description">
                            Latest announcements and updates
                        </p>
                    </div>
                </div>
            </section>

            {/* News List */}
            <section className="section">
                <div className="container">
                    <div className="section-header" data-aos="fade-up">
                        <span className="section-subtitle">Updates</span>
                        <h2 className="section-title">Latest Announcements</h2>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : announcements.length === 0 ? (
                        <div className="empty-state">
                            <Megaphone size={64} />
                            <h3>No Announcements Yet</h3>
                            <p>Check back later for news and updates.</p>
                        </div>
                    ) : (
                        <div className="news-grid">
                            {announcements.map((news, index) => (
                                <div
                                    key={news.id}
                                    className="news-card"
                                    data-aos="fade-up"
                                    data-aos-delay={(index % 3) * 100}
                                >
                                    <div className="news-date">
                                        <Calendar size={14} />
                                        {new Date(news.published_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <h3 className="news-title">{news.title}</h3>
                                    {news.content && (
                                        <p className="news-excerpt">{news.content.substring(0, 150)}...</p>
                                    )}
                                    {news.link_url && (
                                        <a href={news.link_url} target="_blank" rel="noopener noreferrer" className="news-link">
                                            {news.link_label || 'Read More'} <ExternalLink size={14} />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
