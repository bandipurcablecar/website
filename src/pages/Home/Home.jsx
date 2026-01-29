import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import HeroSlider from '../../components/HeroSlider/HeroSlider';
import NewsTicker from '../../components/NewsTicker/NewsTicker';
import StatsSection from '../../components/StatsSection/StatsSection';
import AboutSection from '../../components/AboutSection/AboutSection';
import HomePopup from '../../components/HomePopup/HomePopup';
import CapitalSection from '../../components/CapitalSection/CapitalSection';
import ProjectsSection from '../../components/ProjectsSection/ProjectsSection';
import AssociatesSection from '../../components/AssociatesSection/AssociatesSection';
import SupportersSection from '../../components/SupportersSection/SupportersSection';
import './Home.css';

export default function Home() {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
        });
    }, []);

    return (
        <main className="home-page">
            <HomePopup />
            <HeroSlider />
            <NewsTicker />
            <StatsSection />
            <AboutSection />
            <CapitalSection />
            <ProjectsSection />
            <AssociatesSection />
            <SupportersSection />
        </main>
    );
}
