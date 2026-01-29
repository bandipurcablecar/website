import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useProjects } from '../../hooks/useData';
import './ProjectsSection.css';

export default function ProjectsSection() {
    const { projects, loading } = useProjects();

    if (loading) return null;

    // Show all projects in the marquee
    const displayProjects = projects;

    // Duplicate projects for seamless infinite scroll
    const duplicatedProjects = [...displayProjects, ...displayProjects];

    return (
        <section className="projects-section section">
            <div className="container">
                {/* Header with Flex layout for View All link */}
                <div className="projects-header-wrapper" data-aos="fade-up">
                    <div className="section-header-left">
                        <span className="project-badge">Our Project</span>
                        <h2 className="section-title">Featured Investments</h2>
                        <p className="section-description">
                            We continuously evolve our business model to focus on our key strengths by collaborating
                            with our shareholder, developing our talent and entering world-class partnerships.
                        </p>
                    </div>
                    <div className="section-header-right">
                        <Link to="/projects" className="view-all-link">
                            View All <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                <div className="projects-marquee-container">
                    <div className="projects-marquee">
                        {duplicatedProjects.map((project, index) => (
                            <Link
                                to={`/projects/${project.slug}`}
                                key={`${project.id}-${index}`}
                                className="feature-card"
                                style={{ backgroundImage: `url(${project.image_url})` }}
                            >
                                <div className="feature-card-content">
                                    <h3 className="feature-card-title">{project.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
