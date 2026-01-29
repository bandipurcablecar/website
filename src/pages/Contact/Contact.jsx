import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useSettings } from '../../hooks/useData';
import { supabase } from '../../lib/supabase';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

export default function Contact() {
    const { settings } = useSettings();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // 1. Submit to Supabase Database (for Admin Panel)
            const { error: dbError } = await supabase
                .from('inquiries')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        message: formData.message,
                        status: 'new' // Default status
                    }
                ]);

            if (dbError) {
                console.error('Database submission failed:', dbError);
                // We typically continue to Formspree even if DB fails, or throw error depending on strictness.
                // Let's log it but try to send the email anyway.
            }

            // 2. Submit to Formspree (for Email Notification)
            const response = await fetch("https://formspree.io/f/xqeevrkb", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsSubmitted(true);
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    throw new Error(data.errors.map(error => error.message).join(", "));
                } else {
                    throw new Error('Form submission failed');
                }
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            setError('Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldOffice = settings?.field_office || {
        address: 'Bandipur-4, Thuldhunga, Tanahun',
        phone: ['065-580457', '9802815792'],
        email: 'info@bandipurcablecar.com.np'
    };

    const corporateOffice = settings?.corporate_office || {
        address: 'Kalimati 13, Kathmandu',
        phone: ['01-5924251'],
        email: 'info@bandipurcablecar.com.np'
    };

    const openingHours = settings?.opening_hours || {
        weekday: 'Sun - Fri: 07:30 AM – 06:15 PM',
        weekend: 'Sat-Sun: 07:30 AM – 18:15 PM'
    };

    return (
        <main className="contact-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-bg" style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920)`
                }}></div>
                <div className="page-hero-overlay"></div>
                <div className="container">
                    <div className="page-hero-content" data-aos="fade-up">
                        <span className="page-hero-subtitle">Contact Us</span>
                        <h1 className="page-hero-title">Get in Touch</h1>
                        <p className="page-hero-description">
                            We'd love to hear from you. Send us a message!
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Information */}
                        <div className="contact-info" data-aos="fade-right">
                            <h2 className="contact-info-title">Contact Information</h2>
                            <p className="contact-info-text">
                                Fill out the form and our team will get back to you within 24 hours.
                            </p>

                            {/* Field Office */}
                            <div className="contact-office">
                                <h3 className="office-title">Field Office</h3>
                                <div className="contact-item">
                                    <MapPin className="contact-icon" size={20} />
                                    <span>{fieldOffice.address}</span>
                                </div>
                                {fieldOffice.phone?.map((phone, idx) => (
                                    <div key={idx} className="contact-item">
                                        <Phone className="contact-icon" size={20} />
                                        <a href={`tel:${phone}`}>{phone}</a>
                                    </div>
                                ))}
                                <div className="contact-item">
                                    <Mail className="contact-icon" size={20} />
                                    <a href={`mailto:${fieldOffice.email}`}>{fieldOffice.email}</a>
                                </div>
                            </div>

                            {/* Corporate Office */}
                            <div className="contact-office">
                                <h3 className="office-title">Corporate Office</h3>
                                <div className="contact-item">
                                    <MapPin className="contact-icon" size={20} />
                                    <span>{corporateOffice.address}</span>
                                </div>
                                {corporateOffice.phone?.map((phone, idx) => (
                                    <div key={idx} className="contact-item">
                                        <Phone className="contact-icon" size={20} />
                                        <a href={`tel:${phone}`}>{phone}</a>
                                    </div>
                                ))}
                            </div>

                            {/* Opening Hours */}
                            <div className="contact-office">
                                <h3 className="office-title">Opening Hours</h3>
                                <div className="contact-item">
                                    <Clock className="contact-icon" size={20} />
                                    <span>{openingHours.weekday}</span>
                                </div>
                                <div className="contact-item">
                                    <Clock className="contact-icon" size={20} />
                                    <span>{openingHours.weekend}</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="contact-form-wrapper" data-aos="fade-left">
                            {isSubmitted ? (
                                <div className="form-success">
                                    <CheckCircle size={64} className="success-icon" />
                                    <h3>Thank You!</h3>
                                    <p>Your message has been sent successfully. We'll get back to you soon.</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setIsSubmitted(false)}
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="contact-form">
                                    <h2 className="form-title">Send us a Message</h2>

                                    {error && <div className="form-error">{error}</div>}

                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Full Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="email" className="form-label">Email *</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="form-input"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone" className="form-label">Phone</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="form-input"
                                                placeholder="+977 9800000000"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="message" className="form-label">Message *</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            className="form-textarea"
                                            placeholder="How can we help you?"
                                            rows={6}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg form-submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                        <Send size={18} />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="map-section">
                <iframe
                    title="Bandipur Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8595925825673!2d84.41559!3d27.9364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDU2JzExLjAiTiA4NMKwMjQnNTYuMSJF!5e0!3m2!1sen!2snp!4v1600000000000!5m2!1sen!2snp"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </section>
        </main>
    );
}
