import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useData';
import { ChevronRight, Building2, Hotel, Mountain, Bike } from 'lucide-react';
import './Projects.css';

export default function Projects() {
    const { projects, loading } = useProjects();

    useEffect(() => {
        AOS.init({ duration: 800, once: true, offset: 100 });
    }, []);

    const statusColors = {
        operational: '#10b981',
        construction: '#f59e0b',
        planning: '#6b7280'
    };

    return (
        <main className="projects-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-bg" style={{
                    backgroundImage: `url(https://bandipurcablecar.com.np/assets/img/investment/investing.jpg)`
                }}></div>
                <div className="page-hero-overlay"></div>
                <div className="container">
                    <div className="page-hero-content" data-aos="fade-up">
                        <span className="page-hero-subtitle">What We Do</span>
                        <h1 className="page-hero-title">Our Projects</h1>
                        <p className="page-hero-description">
                            Cablecar, Hotel & Adventure Tourism
                        </p>
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="section">
                <div className="container">
                    <div className="section-header" data-aos="fade-up">
                        <span className="section-subtitle">Featured Investments</span>
                        <h2 className="section-title">Cablecar and Hotel</h2>
                        <p className="section-description">
                            We continuously evolve our business model to focus on our key strengths by collaborating
                            with our shareholders, developing our talent and entering world-class partnerships.
                        </p>
                    </div>

                    {loading ? (
                        <div className="projects-loading">
                            <div className="loading-spinner"></div>
                            <p>Loading projects...</p>
                        </div>
                    ) : (
                        <div className="projects-page-grid">
                            {projects.map((project, index) => (
                                <Link
                                    to={`/projects/${project.slug}`}
                                    key={project.id}
                                    className="project-card-large"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    <div className="project-image">
                                        <img src={project.image_url || 'https://bandipurcablecar.com.np/assets/img/investment/investing.jpg'} alt={project.title} />
                                        <div className="project-status" style={{ backgroundColor: statusColors[project.status] || '#6b7280' }}>
                                            {project.status}
                                        </div>
                                    </div>
                                    <div className="project-content">
                                        <h3 className="project-title">{project.title}</h3>
                                        <p className="project-description">{project.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Additional Info */}
            <section className="section section-gray">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-box" data-aos="fade-up">
                            <div className="feature-box-icon">
                                <Building2 size={32} />
                            </div>
                            <h3>Complete Holiday Package</h3>
                            <p>Experience the best of Bandipur with our comprehensive tourism packages including stay, dining, and adventure activities.</p>
                        </div>
                        <div className="feature-box" data-aos="fade-up" data-aos-delay="100">
                            <div className="feature-box-icon">
                                <Hotel size={32} />
                            </div>
                            <h3>Queen Tower Hotel</h3>
                            <p>Luxury accommodation at the hilltop with stunning mountain views, partnered with Lemon Tree Hotels Limited.</p>
                        </div>
                        <div className="feature-box" data-aos="fade-up" data-aos-delay="200">
                            <div className="feature-box-icon">
                                <Mountain size={32} />
                            </div>
                            <h3>Cable Car Experience</h3>
                            <p>South Asia's unique cable car that lands inside the hotel, offering 500 passengers per hour capacity.</p>
                        </div>
                        <div className="feature-box" data-aos="fade-up" data-aos-delay="300">
                            <div className="feature-box-icon">
                                <Bike size={32} />
                            </div>
                            <h3>Adventure Activities</h3>
                            <p>Sky Cycling, Zipline, and various other adventure activities for thrill seekers of all ages.</p>
                        </div>
                    </div>
                </div>
            </section>

            <ProjectInfoSection />
        </main>
    );
}

function ProjectInfoSection() {
    return (
        <section className="section bg-white">
            <div className="container">
                <div className="section-header center" data-aos="fade-up">
                    <span className="section-subtitle">Discover More</span>
                    <h2 className="section-title">Project Highlights & Information</h2>
                </div>

                <div className="project-info-grid">
                    {/* Features Column */}
                    <div className="info-column" data-aos="fade-up">
                        <h3 className="info-title">Bandipur Cable Car Features</h3>
                        <p className="info-text">
                            Located in the Queen of Hills, Bandipur Cable Car is a major attraction for both domestic and international tourists.
                            It connects the Prithvi Highway (Dumre) to the ancient town of Bandipur (1686m distance).
                            The cable car offers a 90-degree climb experience, reaching a height of 3500 ft. It is the first of its kind in South Asia
                            allowing guests to land directly inside the hotel.
                        </p>

                        <h3 className="info-title mt-6">Restaurant Features</h3>
                        <p className="info-text">
                            A drive-in restaurant on the Prithvi Highway offering hygienic food, fast service, and a relaxing atmosphere.
                            It features Fast Food, Continental dining, Chiya Coffee, and is an ideal rest stop for travelers.
                            Facilities include ample parking, a garden, electrical vehicle charging, and a photo session area.
                        </p>
                    </div>

                    {/* Bandipur Info Column */}
                    <div className="info-column" data-aos="fade-up" data-aos-delay="100">
                        <h3 className="info-title">Attractions of Bandipur</h3>
                        <ul className="info-list">
                            <li>
                                <strong>Cultural & Historical:</strong> Khadga Devi Temple (built by King Mukunda Sen), Thani Mai Temple, Newari Architecture & Culture.
                            </li>
                            <li>
                                <strong>Natural Beauty:</strong> Siddha Gufa (Cave) - one of the largest in South Asia (430m deep), Rani Ban (Queen's Forest).
                            </li>
                            <li>
                                <strong>Adventure:</strong> Hiking routes to Ramkot, Paragliding, Rock Climbing.
                            </li>
                            <li>
                                <strong>Local Experience:</strong> Traditional Newari festivals, local market, and organic farming (Goat Farm, Silk Farm, Orange Farm).
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Tech Specs & Facilities */}
                <div className="specs-container mt-12">
                    <div className="specs-grid">
                        {/* Distances */}
                        <div className="spec-card" data-aos="fade-up" data-aos-delay="200">
                            <h4>Distances (from Lower Station)</h4>
                            <ul className="spec-list">
                                <li><span>Dumre</span> <span>9 Km</span></li>
                                <li><span>Kathmandu</span> <span>143 Km</span></li>
                                <li><span>Pokhara</span> <span>68 Km</span></li>
                                <li><span>Chitwan</span> <span>64 Km</span></li>
                            </ul>
                        </div>

                        {/* Technical Details */}
                        <div className="spec-card" data-aos="fade-up" data-aos-delay="300">
                            <h4>Technical Details</h4>
                            <ul className="spec-list">
                                <li><span>Length</span> <span>1686 Meters</span></li>
                                <li><span>Gondolas</span> <span>21 Cabins</span></li>
                                <li><span>Capacity</span> <span>500 Persons/Hour</span></li>
                                <li><span>Towers</span> <span>11 Towers</span></li>
                                <li><span>Travel Time</span> <span>Approx. 9 Minutes</span></li>
                            </ul>
                        </div>

                        {/* Facilities */}
                        <div className="spec-card wide" data-aos="fade-up" data-aos-delay="400">
                            <h4>Available Facilities</h4>
                            <div className="facilities-tags">
                                <span>Restaurant</span>
                                <span>Parking</span>
                                <span>Kids Zone</span>
                                <span>Fast Food</span>
                                <span>Zip Line</span>
                                <span>Sky Cycling</span>
                                <span>Lift</span>
                                <span>Gift Shop</span>
                                <span>Free Shuttle Bus</span>
                                <span>Public Toilet</span>
                                <span>Photo Booths</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
