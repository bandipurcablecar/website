import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAssociateCompanies, useSupporters } from '../../hooks/useData';
import { ExternalLink, Building2 } from 'lucide-react';
import './Associates.css';

export default function Associates() {
    const { companies, loading: loadingCompanies } = useAssociateCompanies();
    const { supporters, loading: loadingSupporters } = useSupporters();

    useEffect(() => {
        AOS.init({ duration: 800, once: true, offset: 100 });
    }, []);

    return (
        <main className="associates-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-bg" style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920)`
                }}></div>
                <div className="page-hero-overlay"></div>
                <div className="container">
                    <div className="page-hero-content" data-aos="fade-up">
                        <span className="page-hero-subtitle">Our Network</span>
                        <h1 className="page-hero-title">Associates & Partners</h1>
                        <p className="page-hero-description">
                            Strong partnerships driving excellence in tourism
                        </p>
                    </div>
                </div>
            </section>

            {/* Associate Companies */}
            <section className="section">
                <div className="container">
                    <div className="section-header" data-aos="fade-up">
                        <span className="section-subtitle">Our Network</span>
                        <h2 className="section-title">Associate Companies</h2>
                    </div>

                    {loadingCompanies ? (
                        <div className="loading-state"><div className="loading-spinner"></div></div>
                    ) : (
                        <div className="associates-page-grid">
                            {companies.map((company, index) => (
                                <a
                                    key={company.id}
                                    href={company.website_url || '#'}
                                    target={company.website_url ? '_blank' : '_self'}
                                    rel="noopener noreferrer"
                                    className="associate-card"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    <div className="associate-logo">
                                        {company.logo_url ? (
                                            <img src={company.logo_url} alt={company.name} />
                                        ) : (
                                            <Building2 size={40} />
                                        )}
                                    </div>
                                    <h3 className="associate-name">{company.name}</h3>
                                    {company.website_url && (
                                        <span className="associate-link">
                                            Visit Website <ExternalLink size={14} />
                                        </span>
                                    )}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Supporters */}
            <section className="section section-gray">
                <div className="container">
                    <div className="section-header" data-aos="fade-up">
                        <span className="section-subtitle">Who Believed in Us</span>
                        <h2 className="section-title">Project Partners & Supporters</h2>
                        <p className="section-description">
                            Our Project Construction and Management Details
                        </p>
                    </div>

                    {loadingSupporters ? (
                        <div className="loading-state"><div className="loading-spinner"></div></div>
                    ) : (
                        <div className="supporters-page-grid">
                            {supporters.map((supporter, index) => (
                                <div
                                    key={supporter.id}
                                    className="supporter-page-card"
                                    data-aos="fade-up"
                                    data-aos-delay={(index % 6) * 50}
                                >
                                    <div className="supporter-page-icon">
                                        {supporter.logo_url ? (
                                            <img src={supporter.logo_url} alt={supporter.name} />
                                        ) : (
                                            <span>{supporter.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="supporter-page-content">
                                        <span className="supporter-page-role">{supporter.role}</span>
                                        <h4 className="supporter-page-name">{supporter.name}</h4>
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
