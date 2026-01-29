import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import './CustomPage.css';

export default function CustomPage() {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPage();
    }, [slug]);

    async function fetchPage() {
        try {
            const { data, error } = await supabase
                .from('custom_pages')
                .select('*')
                .eq('slug', slug)
                .eq('is_published', true)
                .single();

            if (error) throw error;

            if (!data) {
                setError('Page not found');
            } else {
                setPage(data);
                // Update page title and meta tags
                document.title = `${data.title} - Bandipur Cable Car`;
                if (data.meta_description) {
                    updateMetaTag('description', data.meta_description);
                }
                if (data.meta_keywords) {
                    updateMetaTag('keywords', data.meta_keywords);
                }
            }
        } catch (error) {
            console.error('Error fetching page:', error);
            setError('Failed to load page');
        } finally {
            setLoading(false);
        }
    }

    function updateMetaTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = name;
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    if (loading) {
        return (
            <div className="custom-page-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="custom-page-container">
                <div className="error-state">
                    <h2>Page Not Found</h2>
                    <p>The page you are looking for does not exist or has been removed.</p>
                    <Link to="/" className="btn btn-primary">
                        <ArrowLeft size={18} /> Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="custom-page-container">
            {/* Page Header */}
            <div className="custom-page-header">
                <div className="container">
                    <Link to="/" className="back-link">
                        <ArrowLeft size={18} /> Back to Home
                    </Link>
                    <h1 className="page-title" data-aos="fade-up">{page.title}</h1>
                    <div className="page-meta" data-aos="fade-up" data-aos-delay="100">
                        <span className="meta-item">
                            <Calendar size={16} />
                            {new Date(page.updated_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Page Content */}
            <div className="custom-page-content">
                <div className="container">
                    <article
                        className="prose"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                        data-aos="fade-up"
                    />
                </div>
            </div>
        </div>
    );
}
