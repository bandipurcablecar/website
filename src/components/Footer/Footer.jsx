import { Link } from 'react-router-dom';
import { Facebook, Youtube, Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useSettings } from '../../hooks/useData';
import './Footer.css';

export default function Footer() {
    const { settings } = useSettings();

    const quickLinks = settings?.quick_links || [
        { label: 'RKD Holdings', url: 'https://rkdholdings.com.np/' },
        { label: 'Tourism Investment Fund', url: 'https://tifl.com.np/' },
        { label: 'Bizbazar', url: 'https://bizbazar.com.np/' },
    ];

    return (
        <footer className="footer">
            {/* Rating Bar */}
            <div className="footer-rating">
                <div className="container">
                    <div className="rating-content">
                        <span className="rating-text">
                            {settings?.care_rating || settings?.footer_text || 'CARE-NP BB [Double B] rated by'}
                        </span>
                        <a
                            href="https://careratingsnepal.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rating-link"
                        >
                            CARE Ratings Nepal
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">
                        {/* Who We Are */}
                        <div className="footer-col">
                            <h4 className="footer-title">Who We Are</h4>
                            <ul className="footer-nav">
                                <li><Link to="/about">About Bandipur</Link></li>
                                <li><Link to="/structure">Our Structure</Link></li>
                                <li><Link to="/governance">Corporate Governance</Link></li>
                                <li><Link to="/awards">Awards & Recognition</Link></li>
                            </ul>
                        </div>

                        {/* What We Do */}
                        <div className="footer-col">
                            <h4 className="footer-title">What We Do</h4>
                            <ul className="footer-nav">
                                <li><Link to="/projects">Cablecar and Hotel</Link></li>
                            </ul>
                        </div>

                        {/* Investors Relation */}
                        <div className="footer-col">
                            <h4 className="footer-title">Investors Relation</h4>
                            <ul className="footer-nav">
                                <li><Link to="/investors">Financial Reports</Link></li>
                                <li><Link to="/ipo">IPO</Link></li>
                            </ul>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-col">
                            <h4 className="footer-title">Quick Links</h4>
                            <ul className="footer-nav">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                                <li>
                                    <a href="https://forms.gle/VXAjZpoTQRYjttVKA" target="_blank" rel="noopener noreferrer">
                                        Dematerialization of Promoter Share
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <p className="copyright">
                            © {new Date().getFullYear()} {settings?.company_name || 'Bandipur Cable Car & Tourism Ltd.'}. All Rights Reserved.
                        </p>
                        <div className="footer-social">
                            {settings?.social_links?.facebook && (
                                <a href={settings.social_links.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    <Facebook size={18} />
                                </a>
                            )}
                            {settings?.social_links?.youtube && (
                                <a href={settings.social_links.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                                    <Youtube size={18} />
                                </a>
                            )}
                            {settings?.social_links?.instagram && (
                                <a href={settings.social_links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <Instagram size={18} />
                                </a>
                            )}
                            {settings?.social_links?.twitter && (
                                <a href={settings.social_links.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                    <Twitter size={18} />
                                </a>
                            )}
                            {settings?.social_links?.linkedin && (
                                <a href={settings.social_links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                    <Linkedin size={18} />
                                </a>
                            )}
                            {settings?.social_links?.tiktok && (
                                <a href={settings.social_links.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-music-2" // Minimal placeholder style, or custom path
                                    >
                                        <path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </footer >
    );
}
