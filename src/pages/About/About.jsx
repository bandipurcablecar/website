import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useSettings, useAttractions } from '../../hooks/useData';
import { MapPin, Mountain, Camera, TreePine, Landmark, X } from 'lucide-react';
import './About.css';

export default function About() {
    const { settings } = useSettings();
    const { attractions, loading } = useAttractions();
    const [selectedAttraction, setSelectedAttraction] = useState(null);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
        });
    }, []);

    const attractionIcons = [Landmark, Mountain, Camera, TreePine, MapPin];

    return (
        <main className="about-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-bg" style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920)`
                }}></div>
                <div className="page-hero-overlay"></div>
                <div className="container">
                    <div className="page-hero-content" data-aos="fade-up">
                        <span className="page-hero-subtitle">Who We Are</span>
                        <h1 className="page-hero-title">About Bandipur</h1>
                        <p className="page-hero-description">
                            Discover the beauty and heritage of Bandipur
                        </p>
                    </div>
                </div>
            </section>

            {/* About Content */}
            <section className="section">
                <div className="container">
                    <div className="about-content-grid">
                        <div className="about-text-content" data-aos="fade-right">
                            <span className="section-subtitle">बन्दीपुरको जानकारी</span>
                            <h2 className="section-title">About Bandipur</h2>
                            <p className="about-nepali-text">
                                {settings?.about_nepali ||
                                    `ऐतिहासिक सम्पदाले भरिपूर्ण बन्दीपुर, विगतमा भारत र तिब्बत जोड्ने प्राचिन व्यापार मार्गको प्रमुख व्यापारिक केन्द्र रहँदै आएको थियो। 
                  कला, संस्कृति, धर्म र अर्थ यहाँको मुख्य मान्यता रहेका थिए। वनदेवीको वासस्थान रहेकोले बन्दीपुरको नाम सुपरिचित छ।`
                                }
                            </p>
                            <p className="about-text-paragraph" style={{ whiteSpace: 'pre-line' }}>
                                {settings?.about_content ||
                                    `Bandipur is often referred to as a living museum of Newari culture. This picturesque town
                                is perched on a ridge with stunning views of the Himalayas and the Marshyangdi Valley.
                                It is famous for its well-preserved cultural heritage, traditional Newari architecture,
                                and a serene, traffic-free environment.

                                The town offers a unique blend of history, culture, and nature, making it an ideal
                                destination for travelers seeking an authentic Nepalese experience. From here, you can
                                view the world's longest series of mountains at a 227-degree angle.`
                                }
                            </p>
                        </div>
                        <div className="about-image-content" data-aos="fade-left">
                            <img
                                src={settings?.about_image_url || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800"}
                                alt="Bandipur Village"
                                className="about-main-image"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Attractions Section */}
            <section className="section section-gray">
                <div className="container">
                    <div className="section-header" data-aos="fade-up">
                        <span className="section-subtitle">Explore</span>
                        <h2 className="section-title">Major Attractions of Bandipur</h2>
                    </div>

                    <div className="attractions-grid">
                        {loading ? (
                            [...Array(6)].map((_, index) => (
                                <div key={index} className="attraction-card skeleton" style={{ height: '200px' }}></div>
                            ))
                        ) : (
                            attractions.map((attraction, index) => {
                                const IconComponent = attractionIcons[index % attractionIcons.length];
                                return (
                                    <div
                                        key={attraction.id}
                                        className="attraction-card"
                                        onClick={() => setSelectedAttraction(attraction)}
                                        data-aos="fade-up"
                                        data-aos-delay={(index % 5) * 100}
                                    >
                                        {attraction.image_url ? (
                                            <div className="attraction-image-wrapper">
                                                <img
                                                    src={attraction.image_url}
                                                    alt={attraction.title}
                                                />
                                            </div>
                                        ) : (
                                            <div className="attraction-icon">
                                                <IconComponent size={28} />
                                            </div>
                                        )}
                                        <h3 className="attraction-title">{attraction.title}</h3>
                                        {attraction.title_nepali && (
                                            <span className="attraction-title-nepali">{attraction.title_nepali}</span>
                                        )}
                                        <p className="attraction-description">
                                            {attraction.description || 'A beautiful attraction in Bandipur.'}
                                        </p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* Company Info Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header" data-aos="fade-up">
                        <span className="section-subtitle">About the Company</span>
                        <h2 className="section-title">Bandipur Cable Car & Tourism Ltd.</h2>
                    </div>

                    <div className="company-info" data-aos="fade-up">
                        <p>
                            {settings?.about_excerpt ||
                                `Bandipur Cable Car & Tourism Ltd. is a limited company registered with Government of Nepal, 
                Ministry of Industry, Company Registrar Office, Kathmandu on 2078.05.17 BS under registration 
                No. 270364/078/079 and PAN-600918925.`
                            }
                        </p>
                        <p>
                            {settings?.registration_info ||
                                `Having its corporate office at Kalimati - 13, Kathmandu and field office at Bandipur Rural 
                Municipality, Bandipur - 4, Tanahun formerly Bandipur VDC Ward no.3, Tanahun.`
                            }
                        </p>
                    </div>
                </div>
            </section>

            {/* Attraction Modal */}
            {selectedAttraction && (
                <div className="attraction-modal-overlay" onClick={() => setSelectedAttraction(null)}>
                    <div className="attraction-modal-content" onClick={e => e.stopPropagation()} data-aos="zoom-in">
                        <button className="modal-close-btn" onClick={() => setSelectedAttraction(null)}>
                            <X size={24} />
                        </button>
                        <div className="modal-image-container">
                            {selectedAttraction.image_url ? (
                                <img src={selectedAttraction.image_url} alt={selectedAttraction.title} />
                            ) : (
                                <div className="modal-placeholder-icon">
                                    <Mountain size={64} color="#ccc" />
                                </div>
                            )}
                        </div>
                        <div className="modal-details">
                            <h3 className="modal-title">{selectedAttraction.title}</h3>
                            {selectedAttraction.title_nepali && (
                                <h4 className="modal-subtitle">{selectedAttraction.title_nepali}</h4>
                            )}
                            <div className="modal-divider"></div>
                            <p className="modal-description">
                                {selectedAttraction.description || 'No description available.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
