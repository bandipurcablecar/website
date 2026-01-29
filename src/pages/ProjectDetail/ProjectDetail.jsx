import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './ProjectDetail.css';

export default function ProjectDetail() {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProject();
    }, [slug]);

    async function fetchProject() {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) throw error;
            setProject(data);
        } catch (error) {
            console.error('Error fetching project:', error);
        } finally {
            setLoading(false);
        }
    }

    const [galleryImages, setGalleryImages] = useState([]);

    async function fetchGallery() {
        try {
            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .eq('category', slug)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setGalleryImages(data || []);
        } catch (error) {
            console.error('Error fetching gallery:', error);
        }
    }

    useEffect(() => {
        if (slug) {
            fetchGallery();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="project-detail-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="project-detail-error">
                <h2>Project Not Found</h2>
                <Link to="/projects" className="back-link">
                    <ArrowLeft size={20} /> Back to Projects
                </Link>
            </div>
        );
    }

    return (
        <div className="project-detail-page">
            {/* Hero Section with Background Image */}
            <div
                className="project-hero"
                style={{ backgroundImage: `url(${project.image_url})` }}
            >
                <div className="project-hero-overlay">
                    <div className="container">
                        <Link to="/" className="back-link">
                            <ArrowLeft size={20} /> Back to Home
                        </Link>
                        <h1 className="project-title" data-aos="fade-up">{project.title}</h1>
                        <div className="project-meta" data-aos="fade-up" data-aos-delay="100">
                            {project.status && (
                                <span className={`status-badge status-${project.status}`}>
                                    <Tag size={16} /> {project.status}
                                </span>
                            )}
                            {project.created_at && (
                                <span className="project-date">
                                    <Calendar size={16} />
                                    {new Date(project.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="project-content-section">
                <div className="container">
                    <div className="project-content-wrapper">
                        {/* Main Content */}
                        <div className="project-main-content" data-aos="fade-up">
                            <div className="project-description">
                                {project.description ? (
                                    <div className="description-text">
                                        {project.description.split('\n').map((paragraph, index) => (
                                            paragraph.trim() && <p key={index}>{paragraph}</p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-description">No detailed description available for this project yet.</p>
                                )}
                            </div>

                            {/* Featured Image (if different from hero) */}
                            {project.image_url && (
                                <div className="project-featured-image" data-aos="fade-up">
                                    <img src={project.image_url} alt={project.title} />
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="project-sidebar" data-aos="fade-up" data-aos-delay="100">
                            <div className="sidebar-card">
                                <h3>Project Information</h3>
                                <div className="info-item">
                                    <span className="info-label">Status:</span>
                                    <span className={`info-value status-${project.status}`}>
                                        {project.status || 'N/A'}
                                    </span>
                                </div>
                                {project.created_at && (
                                    <div className="info-item">
                                        <span className="info-label">Published:</span>
                                        <span className="info-value">
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Call to Action */}
                            <div className="sidebar-card cta-card">
                                <h3>Interested in this project?</h3>
                                <p>Contact us to learn more about investment opportunities.</p>
                                <Link to="/contact" className="btn btn-primary">
                                    Get in Touch
                                </Link>
                            </div>
                        </aside>
                    </div>

                    {/* Gallery Section */}
                    {galleryImages.length > 0 && (
                        <div className="project-gallery-section" data-aos="fade-up">
                            <h2>Project Gallery</h2>
                            <div className="gallery-grid">
                                {galleryImages.map((image) => (
                                    <div key={image.id} className="gallery-card">
                                        <div className="gallery-image-wrapper">
                                            <img src={image.image_url} alt={image.title || project.title} />
                                        </div>
                                        {(image.title || image.description) && (
                                            <div className="gallery-content">
                                                {image.title && <h3>{image.title}</h3>}
                                                {image.description && <p>{image.description}</p>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Projects Section */}
                    <div className="related-projects-section" data-aos="fade-up">
                        <h2>Explore More Projects</h2>
                        <Link to="/projects" className="btn btn-outline">
                            View All Projects
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
