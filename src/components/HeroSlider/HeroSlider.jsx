import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { ChevronRight } from 'lucide-react';
import { useSettings } from '../../hooks/useData';
import './HeroSlider.css';

export default function HeroSlider() {
    const { settings } = useSettings();

    const defaultSlides = [
        {
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920',
            title: 'Experience Bandipur',
            subtitle: 'Queen of Hills',
            description: 'Discover the beauty of Bandipur with our scenic cable car ride'
        },
        {
            image: 'https://images.unsplash.com/photo-1566073771259-6a85060e9089?w=1920',
            title: 'Queen Tower Hotel',
            subtitle: 'Luxury Awaits',
            description: 'Experience world-class hospitality at the hilltop'
        },
        {
            image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920',
            title: 'Luxury Resort',
            subtitle: 'Lemon Tree Hotels',
            description: 'Agreement with Lemon Tree Hotels Limited for Queen Tower Hotel'
        }
    ];

    const slides = settings?.hero_slides?.length > 0 ? settings.hero_slides : defaultSlides;

    return (
        <section className="hero-slider">
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                effect="fade"
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="hero-swiper"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div className="hero-slide">
                            <div className="hero-bg" style={{ backgroundImage: `url(${slide.image})` }}></div>
                            <div className="hero-overlay"></div>
                            <div className="container">
                                <div className="hero-content">
                                    <span className="hero-subtitle">{slide.subtitle}</span>
                                    <h1 className="hero-title">{slide.title}</h1>
                                    {slide.description && (
                                        <p className="hero-description">{slide.description}</p>
                                    )}
                                    {slide.link && (
                                        <div className="hero-buttons">
                                            <a href={slide.link} className="btn btn-primary btn-lg">
                                                Explore More
                                                <ChevronRight size={18} />
                                            </a>
                                            <a href="/contact" className="btn btn-outline btn-lg">
                                                Contact Us
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Scroll indicator */}
            <div className="scroll-indicator">
                <div className="scroll-mouse">
                    <div className="scroll-wheel"></div>
                </div>
                <span>Scroll Down</span>
            </div>
        </section>
    );
}
