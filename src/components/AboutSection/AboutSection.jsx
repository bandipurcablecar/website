import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useSettings } from '../../hooks/useData';
import './AboutSection.css';

export default function AboutSection() {
    const { settings } = useSettings();
    const homeAbout = settings?.home_about || {};

    const features = homeAbout.features_list
        ? homeAbout.features_list.split(',').map(f => f.trim()).filter(f => f)
        : ['Complete Holiday Package', 'Sky Cycling & Zipline', 'Drive-inn Restaurant', 'Mahadev Statue'];

    return (
        <section className="about-section section">
            <div className="container">
                <div className="about-grid">
                    {/* Images */}
                    <div className="about-images" data-aos="fade-right">
                        <div className="about-image about-image-main">
                            <img
                                src={homeAbout.image_1 || "https://bandipurcablecar.com.np/assets/img/about/about-img1.jpeg"}
                                alt="Bandipur Cable Car"
                            />
                        </div>
                        <div className="about-image about-image-secondary">
                            <img
                                src={homeAbout.image_2 || "https://bandipurcablecar.com.np/assets/img/about/about-img2.png"}
                                alt="Queen Tower Hotel"
                            />
                        </div>
                        <div className="about-experience">
                            <span className="experience-number">{homeAbout.experience_count || '45+'}</span>
                            <span className="experience-text">{homeAbout.experience_text || 'Years Combined Experience'}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="about-content" data-aos="fade-left">
                        <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--spacing-8)' }}>
                            <span className="section-subtitle" style={{ marginLeft: 0 }}>About Us</span>
                            <h2 className="section-title">{homeAbout.title || 'Cable Car With Tourism'}</h2>
                        </div>

                        <p className="about-text">
                            {settings?.about_excerpt ||
                                `Bandipur Cable Car & Tourism Ltd. is a limited company registered with Government of Nepal, 
                Ministry of Industry, Company Registrar Office, Kathmandu on 2078.05.17 BS under registration 
                No. 270364/078/079 and PAN-600918925 having its corporate office at Kalimati - 13, Kathmandu 
                and field office at Bandipur Rural Municipality, Bandipur - 4, Tanahun.`
                            }
                        </p>

                        <div className="about-features">
                            {features.map((feature, index) => (
                                <div className="feature-item" key={index}>
                                    <div className="feature-icon">✓</div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Link to="/about-bandipur" className="btn btn-primary btn-lg">
                            Explore More
                            <ChevronRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
