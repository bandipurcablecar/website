import { Users, Clock, Mountain, Building } from 'lucide-react';
import { useSettings } from '../../hooks/useData';
import './StatsSection.css';

export default function StatsSection() {
    const { settings } = useSettings();

    const stats = [
        {
            icon: Users,
            value: settings?.stats?.visitors || '5 Lakhs',
            label: 'Yearly Visitors',
            description: 'Expected visitors per annum'
        },
        {
            icon: Clock,
            value: settings?.stats?.capacity || '500',
            label: 'Passengers/Hour',
            description: 'Cable car capacity'
        },
        {
            icon: Mountain,
            value: '227°',
            label: 'Himalayan View',
            description: 'Panoramic angle of view'
        },
        {
            icon: Building,
            value: 'South Asia',
            label: 'Unique Cable Car',
            description: 'Lands inside Queen Tower Hotel'
        }
    ];

    return (
        <section className="stats-section">
            <div className="container">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="stat-card"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <div className="stat-icon">
                                <stat.icon size={28} />
                            </div>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                            <p className="stat-description">{stat.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
