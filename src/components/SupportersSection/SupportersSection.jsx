import { useSupporters } from '../../hooks/useData';
import './SupportersSection.css';

export default function SupportersSection() {
    const { supporters, loading } = useSupporters();

    return (
        <section className="supporters-section section section-gray">
            <div className="container">
                <div className="section-header" data-aos="fade-up">
                    <span className="section-subtitle">Who Believed in Us</span>
                    <h2 className="section-title">Our Supporters</h2>
                    <p className="section-description">
                        Our Project Construction and Management Details
                    </p>
                </div>

                <div className="supporters-grid">
                    {loading ? (
                        [...Array(6)].map((_, index) => (
                            <div key={index} className="supporter-card skeleton" style={{ height: '120px' }}></div>
                        ))
                    ) : (
                        supporters.map((supporter, index) => (
                            <a
                                key={supporter.id}
                                href={supporter.website_url || '#'}
                                target={supporter.website_url ? '_blank' : '_self'}
                                rel="noopener noreferrer"
                                className="supporter-card"
                                data-aos="fade-up"
                                data-aos-delay={(index % 6) * 50}
                            >
                                <div className="supporter-icon">
                                    {supporter.logo_url ? (
                                        <img src={supporter.logo_url} alt={supporter.name} />
                                    ) : (
                                        <span>{supporter.name.charAt(0)}</span>
                                    )}
                                </div>
                                <div className="supporter-content">
                                    <span className="supporter-role">{supporter.role}</span>
                                    <h4 className="supporter-name">{supporter.name}</h4>
                                </div>
                            </a>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
