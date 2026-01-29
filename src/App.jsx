import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Projects from './pages/Projects/Projects';
import ProjectDetail from './pages/ProjectDetail/ProjectDetail';
import CustomPage from './pages/CustomPage/CustomPage';
import Associates from './pages/Associates/Associates';
import Investors from './pages/Investors/Investors';
import BasicShareholders from './pages/Investors/BasicShareholders';
import IPO from './pages/IPO/IPO';
import Downloads from './pages/Downloads/Downloads';
import Structure from './pages/Structure/Structure';
import Media from './pages/Media/Media';
import Progress from './pages/Progress/Progress';
import Admin from './pages/Admin/Admin';
import './index.css';

import CompanySnapshot from './pages/CompanySnapshot/CompanySnapshot';
import CEOMessage from './pages/CEOMessage/CEOMessage';
import Governance from './pages/Governance/Governance';
import ChairmanMessage from './pages/ChairmanMessage/ChairmanMessage';
import { useSettings } from './hooks/useData';
import { useEffect } from 'react';
import Awards from './pages/Awards/Awards';
import CSR from './pages/CSR/CSR';

function FaviconManager() {
  const { settings } = useSettings();

  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';

    if (settings?.social_links?.favicon) {
      link.href = settings.social_links.favicon;
      document.getElementsByTagName('head')[0].appendChild(link);
    } else if (settings?.logo_url && !settings.logo_url.toLowerCase().endsWith('.mp4')) {
      link.href = settings.logo_url;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [settings]);

  return null;
}

function App() {
  return (
    <Router>
      <FaviconManager />
      <div className="app">
        <Routes>
          {/* Admin routes (no header/footer) */}
          <Route path="/admin/*" element={<Admin />} />

          {/* Public routes */}
          <Route path="*" element={
            <>
              <Header />
              <Routes>
                {/* Home */}
                <Route path="/" element={<Home />} />

                {/* Who We Are */}
                <Route path="/about" element={<About />} />
                <Route path="/about-bandipur" element={<CompanySnapshot />} />
                <Route path="/message-from-ceo" element={<CEOMessage />} />
                <Route path="/structure" element={<Structure />} />
                <Route path="/our-structure" element={<Structure />} />
                <Route path="/governance" element={<Governance />} />
                <Route path="/chairman-message" element={<ChairmanMessage />} />
                <Route path="/awards" element={<Awards />} />
                <Route path="/award-recognition" element={<Awards />} />
                <Route path="/csr" element={<CSR />} />

                {/* What We Do */}
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="/cablecar" element={<Projects />} />
                <Route path="/hotel" element={<Projects />} />
                <Route path="/sky-cycling" element={<Projects />} />
                <Route path="/zipline" element={<Projects />} />
                <Route path="/associates" element={<Associates />} />

                {/* Investors */}
                <Route path="/investors" element={<Investors />} />
                <Route path="/basic-shareholders" element={<BasicShareholders />} />
                <Route path="/ipo" element={<IPO />} />
                <Route path="/downloads" element={<Downloads />} />
                <Route path="/agm" element={<Investors />} />
                <Route path="/financial-reports" element={<Investors />} />

                {/* Media & Progress */}
                <Route path="/media" element={<Media />} />
                <Route path="/news" element={<Media />} />
                <Route path="/announcements" element={<Media />} />
                <Route path="/progress" element={<Progress />} />

                {/* Contact */}
                <Route path="/contact" element={<Contact />} />

                {/* Custom Pages - Must be last to act as catch-all for dynamic pages */}
                <Route path="/:slug" element={<CustomPage />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
