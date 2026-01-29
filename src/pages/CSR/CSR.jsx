import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Heart, Users, Leaf, GraduationCap, Globe } from 'lucide-react';
import './csr.css';

export default function CSR() {
    const [dynamicContent, setDynamicContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 800, once: true, offset: 100 });
        fetchCSRContent();

        // Refresh AOS on load
        window.addEventListener('load', AOS.refresh);
        return () => window.removeEventListener('load', AOS.refresh);
    }, []);

    async function fetchCSRContent() {
        try {
            const { data, error } = await supabase
                .from('custom_pages')
                .select('*')
                .eq('slug', 'csr')
                .eq('is_published', true)
                .single();

            if (data) {
                setDynamicContent(data);
            }
        } catch (error) {
            console.error('Error fetching CSR content:', error);
        } finally {
            setLoading(false);
        }
    }

    const activityItems = [
        {
            icon: Users,
            title: "Community Development",
            description: "Empowering local communities through skills training, job creation, and infrastructure support.",
            items: [
                "Local employment priority (80% local staff)",
                "Skills development workshops",
                "Supporting local businesses and suppliers"
            ]
        },
        {
            icon: Leaf,
            title: "Environmental Stewardship",
            description: "Committing to sustainable tourism practices and preserving the natural beauty of Bandipur.",
            items: [
                "Zero-waste initiatives",
                "Tree plantation drives",
                "Eco-friendly construction practices"
            ]
        },
        {
            icon: GraduationCap,
            title: "Education Support",
            description: "Investing in the future by supporting local schools and educational initiatives.",
            items: [
                "Scholarships for local students",
                "School infrastructure support",
                "Educational tours for students"
            ]
        },
        {
            icon: Globe,
            title: "Cultural Preservation",
            description: "Promoting and preserving the rich heritage and culture of Bandipur.",
            items: [
                "Supporting local festivals",
                "Preserving traditional architecture",
                "Promoting local arts and crafts"
            ]
        }
    ];

    return (
        <main className="csr-page">
            <section className="page-hero">
                <div className="page-hero-bg" style={{
                    backgroundImage: `url(https://bandipurcablecar.com.np/assets/img/banner-1.jpeg)`
                }}></div>
                <div className="page-hero-overlay"></div>
                <div className="container">
                    <div className="page-hero-content" data-aos="fade-up">
                        <span className="page-hero-subtitle">Social Responsibility</span>
                        <h1 className="page-hero-title">{dynamicContent ? dynamicContent.title : "CSR Initiatives"}</h1>
                        <p className="page-hero-description">Giving back to the community that supports us</p>
                    </div>
                </div>
            </section>



            {
                dynamicContent ? (
                    <section className="section">
                        <div className="container">
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: dynamicContent.content }}
                                data-aos="fade-up"
                            />
                        </div>
                    </section>
                ) : (
                    <>
                        <section className="section introduction-section">
                            <div className="container">
                                <div className="intro-content" data-aos="fade-up">
                                    <h2>Committed to Community & Environment</h2>
                                    <div className="title-divider"></div>
                                    <p>
                                        At Bandipur Cable Car & Tourism Limited, we believe that sustainable tourism goes beyond just business.
                                        It's about creating a positive impact on the lives of people and the environment around us.
                                        Our Corporate Social Responsibility (CSR) initiatives are designed to foster inclusive growth,
                                        environmental sustainability, and cultural preservation.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="section activities-section">
                            <div className="container">
                                <div className="activities-grid">
                                    {activityItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="activity-card"
                                            data-aos="fade-up"
                                            data-aos-delay={index * 100}
                                        >
                                            <div className="activity-icon-wrapper">
                                                <item.icon size={32} />
                                            </div>
                                            <h3>{item.title}</h3>
                                            <p className="activity-desc">{item.description}</p>
                                            <ul className="activity-list">
                                                {item.items.map((subItem, subIndex) => (
                                                    <li key={subIndex}>{subItem}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="section impact-section">
                            <div className="container">
                                <div className="impact-box" data-aos="fade-up">
                                    <div className="impact-icon">
                                        <Heart size={48} />
                                    </div>
                                    <h2>Our Impact Goal</h2>
                                    <p>
                                        We aim to allocate a significant portion of our annual profits towards community welfare
                                        projects, ensuring that the growth of Bandipur Cable Car translates into the prosperity
                                        of the entire Bandipur region.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </>
                )
            }
        </main >
    );
}
