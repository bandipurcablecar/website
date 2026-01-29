import { Link } from 'react-router-dom';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { useAssociateCompanies } from '../../hooks/useData';
import './AssociatesSection.css';

export default function AssociatesSection() {
    const { companies, loading } = useAssociateCompanies();

    return (
        <section className="associates-section section">
            <div className="container">
                <div className="section-header" data-aos="fade-up">
                    <span className="section-subtitle">Associate Companies</span>
                    <h2 className="section-title">Our Associate Companies</h2>
                </div>

                <div className="associates-grid">
                    {loading ? (
                        [...Array(4)].map((_, index) => (
                            <div key={index} className="partner-card skeleton" style={{ height: '180px' }}></div>
                        ))
                    ) : (
                        companies.map((company, index) => (
                            <a
                                key={company.id}
                                href={company.website_url || '#'}
                                target={company.website_url ? '_blank' : '_self'}
                                rel="noopener noreferrer"
                                className="partner-card"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="partner-logo">
                                    {company.logo_url ? (
                                        <img src={company.logo_url} alt={company.name} />
                                    ) : (
                                        company.name.split(' ').map(word => word[0]).join('').slice(0, 2)
                                    )}
                                </div>
                                <h4 className="partner-name">{company.name}</h4>
                                {company.website_url && (
                                    <span className="partner-link">
                                        Visit <ExternalLink size={12} />
                                    </span>
                                )}
                            </a>
                        ))
                    )}
                </div>

                <div className="associates-action" data-aos="fade-up">
                    <Link to="/associates" className="btn btn-primary">
                        View All Associates
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
