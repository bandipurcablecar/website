import { Building2, Coins, Wallet } from 'lucide-react';
import { useSettings } from '../../hooks/useData';
import './CapitalSection.css';

export default function CapitalSection() {
    const { settings } = useSettings();

    const capitalInfo = settings?.capital_info || {
        authorized: '3 Arba',
        issued: '2 Arba 55 Crore',
        paid_up: '2 Arba 24 Crore'
    };

    const capitalItems = [
        {
            icon: Building2,
            label: 'Authorized Capital',
            value: capitalInfo.authorized
        },
        {
            icon: Coins,
            label: 'Issued Capital',
            value: capitalInfo.issued
        },
        {
            icon: Wallet,
            label: 'Paid-up Share Capital',
            value: capitalInfo.paid_up
        }
    ];

    return (
        <section className="capital-section section section-dark">
            <div className="capital-bg"></div>
            <div className="container">
                <div className="capital-content">
                    {/* Left Side - Counters */}
                    <div className="capital-counters" data-aos="fade-right">
                        <div className="counter-item">
                            <span className="counter-value">{settings?.company_overview?.promoter_share || '22,400,000'}</span>
                            <span className="counter-label">Promoter Share</span>
                        </div>
                        <div className="counter-item">
                            <span className="counter-value">{settings?.company_overview?.employee_count || '50+'}</span>
                            <span className="counter-label">No. of Employees</span>
                        </div>
                    </div>

                    {/* Right Side - Header */}
                    <div className="capital-header" data-aos="fade-left">
                        <span className="section-subtitle">{settings?.company_overview?.subtitle || 'Welcome to our company'}</span>
                        <h2 className="section-title">
                            {settings?.company_overview?.title || 'Bandipur is a sovereign investor company managing a diverse portfolio of assets in Tourism Sector'}
                        </h2>
                        <p className="capital-note">{settings?.company_overview?.audit_note || 'As Per Audit 2080/81'}</p>
                    </div>
                </div>

                {/* Capital Cards */}
                <div className="capital-cards">
                    {capitalItems.map((item, index) => (
                        <div
                            key={index}
                            className="capital-card"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="capital-card-icon">
                                <item.icon size={32} />
                            </div>
                            <div className="capital-card-content">
                                <span className="capital-card-label">{item.label}</span>
                                <span className="capital-card-value">{item.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
