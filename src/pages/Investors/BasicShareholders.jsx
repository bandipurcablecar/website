import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { supabase } from '../../lib/supabase';
import { ExternalLink, MapPin, Briefcase, GraduationCap, Users } from 'lucide-react';
import './BasicShareholders.css';

export default function BasicShareholders() {
    const [shareholders, setShareholders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 800, once: true, offset: 100 });
        fetchShareholders();
    }, []);

    useEffect(() => {
        if (!loading) {
            setTimeout(() => {
                AOS.refresh();
            }, 100);
        }
    }, [loading]);

    async function fetchShareholders() {
        try {
            const { data, error } = await supabase
                .from('basic_shareholders')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setShareholders(data || []);
        } catch (error) {
            console.error('Error fetching shareholders:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleCardClick = (url) => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <main className="basic-shareholders-page">
            <section className="page-hero">
                <div className="page-hero-bg" style={{
                    backgroundImage: `url(https://bandipurcablecar.com.np/assets/img/banner-1.jpeg)`
                }}></div>
                <div className="page-hero-overlay"></div>
                <div className="container">
                    <div className="page-hero-content" data-aos="fade-up">
                        <span className="page-hero-subtitle">Our Partners</span>
                        <h1 className="page-hero-title">Key Shareholders</h1>
                        <p className="page-hero-description">The pillars supporting our vision</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="loading-spinner mx-auto mb-4"></div>
                            <p>Loading shareholder information...</p>
                        </div>
                    ) : shareholders.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No shareholder information available.</p>
                        </div>
                    ) : (
                        <div className="shareholders-grid">
                            {shareholders.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className={`shareholder-card ${item.website_url ? 'clickable' : ''}`}
                                    onClick={() => handleCardClick(item.website_url)}
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    <div className="shareholder-header">
                                        <div className="flex items-center justify-between mb-4">
                                            {item.logo_url && (
                                                <div className="shareholder-logo-container">
                                                    <img
                                                        src={item.logo_url}
                                                        alt={`${item.name} Logo`}
                                                        className="shareholder-logo"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <h2 className="shareholder-name">
                                            {item.name}
                                            {item.website_url && <ExternalLink size={24} className="external-link-icon" />}
                                        </h2>
                                        <div className="shareholder-meta">
                                            <span className="share-badge">{item.share_percentage} Share</span>
                                            {item.address && (
                                                <span className="shareholder-address">
                                                    <MapPin size={16} /> {item.address}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="shareholder-body">
                                        {item.description && (
                                            <p className="shareholder-description">{item.description}</p>
                                        )}

                                        {item.education && (
                                            <div className="shareholder-detail-group">
                                                <h4 className="detail-title"><GraduationCap size={16} /> Education</h4>
                                                <p className="detail-text">{item.education}</p>
                                            </div>
                                        )}

                                        {item.directors && Array.isArray(item.directors) && item.directors.length > 0 && (
                                            <div className="shareholder-detail-group">
                                                <h4 className="detail-title"><Users size={16} /> Key People</h4>
                                                <ul className="detail-list">
                                                    {item.directors.map((d, i) => (
                                                        <li key={i}>{d}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {item.experience && Array.isArray(item.experience) && item.experience.length > 0 && (
                                            <div className="shareholder-detail-group">
                                                <h4 className="detail-title"><Briefcase size={16} /> Experience</h4>
                                                <ul className="detail-list">
                                                    {item.experience.map((e, i) => (
                                                        <li key={i}>{e}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
