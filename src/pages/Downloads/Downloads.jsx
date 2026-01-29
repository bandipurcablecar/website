import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { supabase } from '../../lib/supabase';
import { FileText, Download, Search, Filter } from 'lucide-react';
import './Downloads.css';

export default function Downloads() {
    const [documents, setDocuments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        AOS.init({ duration: 800, once: true, offset: 100 });
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [docsRes, catsRes] = await Promise.all([
                supabase.from('documents').select('*').order('published_at', { ascending: false }),
                supabase.from('document_categories').select('*').order('label', { ascending: true })
            ]);

            if (docsRes.error) throw docsRes.error;
            if (catsRes.error) throw catsRes.error;

            setDocuments(docsRes.data || []);
            setCategories(catsRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    // Filter Logic
    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // Helper to get category label
    const getCategoryLabel = (slug) => {
        const cat = categories.find(c => c.slug === slug);
        return cat ? cat.label : slug.replace('-', ' ');
    };

    return (
        <main className="downloads-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-bg" style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920)`
                }}></div>
                <div className="page-hero-overlay"></div>
                <div className="container">
                    <div className="page-hero-content" data-aos="fade-up">
                        <span className="page-hero-subtitle">Resources</span>
                        <h1 className="page-hero-title">Downloads & Documents</h1>
                        <p className="page-hero-description">
                            Access all official announcements, reports, brochures, and forms in one place.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="section bg-gray-50">
                <div className="container">

                    {/* Filters & Search */}
                    <div className="downloads-filters" data-aos="fade-up">
                        <div className="search-box">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="category-tabs">
                            <button
                                className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveCategory('all')}
                            >
                                All
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`category-tab ${activeCategory === cat.slug ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat.slug)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Documents Grid */}
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading documents...</p>
                        </div>
                    ) : filteredDocuments.length > 0 ? (
                        <div className="documents-grid">
                            {filteredDocuments.map((doc, index) => (
                                <div
                                    key={doc.id}
                                    className="document-card"
                                    data-aos="fade-up"
                                    data-aos-delay={(index % 4) * 50}
                                >
                                    <div className="document-icon">
                                        <FileText size={32} />
                                    </div>
                                    <div className="document-info">
                                        <div className="document-meta">
                                            <span className="document-date">
                                                {new Date(doc.published_at || doc.created_at).toLocaleDateString()}
                                            </span>
                                            {doc.fiscal_year && (
                                                <span className="document-year">FY {doc.fiscal_year}</span>
                                            )}
                                        </div>
                                        <h3 className="document-title">{doc.title}</h3>
                                        <div className="document-category-badge">
                                            {getCategoryLabel(doc.category)}
                                        </div>
                                    </div>
                                    <a
                                        href={doc.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="download-btn"
                                        title="Download File"
                                    >
                                        <Download size={20} />
                                        <span>Download</span>
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <div className="no-results-icon">
                                <Search size={48} />
                            </div>
                            <h3>No documents found</h3>
                            <p>Try adjusting your search or category filter.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
