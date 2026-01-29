import { useSettings } from '../../hooks/useData';
import { ExternalLink, ChevronRight } from 'lucide-react';
import './NewsTicker.css';

export default function NewsTicker() {
    const { settings, loading } = useSettings();

    const marqueeItems = settings?.marquee_content || [];

    // Filter active items
    const activeItems = marqueeItems.filter(item => item.is_active !== false);

    if (loading) {
        return null;
    }

    if (activeItems.length === 0) {
        return null;
    }

    return (
        <div className="news-ticker">
            <div className="ticker-label">
                <span>Latest News</span>
            </div>
            <div className="ticker-wrapper">
                <div className="ticker-content">
                    {activeItems.map((item, index) => (
                        <div key={item.id || index} className="ticker-item">
                            <ChevronRight size={14} className="ticker-icon" />
                            {item.link_url ? (
                                <a href={item.link_url} target="_blank" rel="noopener noreferrer">
                                    {item.title}
                                    <ExternalLink size={12} />
                                </a>
                            ) : (
                                <span>{item.title}</span>
                            )}
                            {index < activeItems.length - 1 && (
                                <span className="ticker-separator">|</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
