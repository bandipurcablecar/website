import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Award, Calendar, X } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Awards.css';

export default function Awards() {
    const [awards, setAwards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAward, setSelectedAward] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 800, once: true, offset: 100 });
        fetchAwards();
    }, []);

    async function fetchAwards() {
        try {
            setLoading(true);
            const { data, error: dbError } = await supabase
                .from('awards_recognitions')
                .select('*')
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (dbError) throw dbError;
            setAwards(data || []);
        } catch (err) {
            console.error('Error fetching awards:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (error) {
        return (
            <div className="awards-page" style={{ paddingTop: '200px', textAlign: 'center' }}>
                <p>Error loading awards: {error}</p>
                <button onClick={fetchAwards} style={{ padding: '8px 16px', marginTop: '10px' }}>Retry</button>
            </div>
        );
    }

    return (
        <main className="awards-page">
            <section className="page-hero">
                <div className="page-hero-bg" style={{
                    backgroundImage: `url(https://bandipurcablecar.com.np/assets/img/banner-1.jpeg)`
                }}></div>
                <div className="page-hero-overlay"></div>
                <div className="container">
                    <div className="page-hero-content" data-aos="fade-up">
                        <span className="page-hero-subtitle">Achievements</span>
                        <h1 className="page-hero-title">Awards & Recognitions</h1>
                        <p className="page-hero-description">Proud moments of our journey towards excellence</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading awards...</p>
                        </div>
                    ) : awards.length === 0 ? (
                        <div className="empty-state">
                            <Award size={48} className="empty-icon" />
                            <h3>No Awards Found</h3>
                        </div>
                    ) : (
                        <div className="awards-grid">
                            {awards.map((award, index) => (
                                <div
                                    key={award.id}
                                    className="award-card"
                                    onClick={() => setSelectedAward(award)}
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    <div className="award-image-container">
                                        <img
                                            src={award.image_url || 'https://via.placeholder.com/400x300?text=Award'}
                                            alt={award.title}
                                            className="award-image"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                            }}
                                        />
                                        {award.award_date && (
                                            <div className="award-date-badge">
                                                {new Date(award.award_date).getFullYear()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="award-content">
                                        <h3 className="award-title">{award.title}</h3>
                                        <p className="award-description-preview">
                                            {award.description ? (award.description.length > 100 ? award.description.substring(0, 100) + '...' : award.description) : 'No description available'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Modal */}
            {selectedAward && (
                <div className="modal-overlay" onClick={() => setSelectedAward(null)}>
                    <div className="award-modal" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setSelectedAward(null)}>
                            <X size={24} />
                        </button>

                        <div className="modal-content-grid">
                            <div className="modal-image-col">
                                <div className="modal-image-wrapper">
                                    <img
                                        src={selectedAward.image_url || 'https://via.placeholder.com/400x300?text=Award'}
                                        alt={selectedAward.title}
                                        className="modal-image"
                                    />
                                </div>
                            </div>
                            <div className="modal-info-col">
                                <h2 className="modal-title">{selectedAward.title}</h2>
                                {selectedAward.award_date && (
                                    <div className="modal-date">
                                        <Calendar size={16} />
                                        <span>{new Date(selectedAward.award_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                )}
                                <div className="modal-divider"></div>
                                <div className="modal-description">
                                    <p>{selectedAward.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
