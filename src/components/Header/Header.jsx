import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Mail, Clock } from 'lucide-react';
import { useSettings } from '../../hooks/useData';
import { supabase } from '../../lib/supabase';
import './Header.css';

export default function Header() {
    const { settings } = useSettings();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [customNavItems, setCustomNavItems] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        fetchCustomNavItems();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    async function fetchCustomNavItems() {
        try {
            const { data, error } = await supabase
                .from('custom_pages')
                .select('title, slug, menu_order, parent_menu')
                .eq('is_published', true)
                .eq('show_in_menu', true)
                .order('menu_order', { ascending: true });

            if (data) {
                setCustomNavItems(data);
            }
        } catch (error) {
            console.error('Error fetching custom nav items:', error);
        }
    }

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    }, [location]);

    // Base navigation structure
    const baseNavItems = [
        {
            id: 'who-we-are',
            label: 'Who We Are',
            path: '/about',
            menu_order: 10,
            dropdown: [
                { label: 'Message from CEO', path: '/message-from-ceo', menu_order: 10 },
                { label: 'About Bandipur', path: '/about', menu_order: 20 },
                { label: 'Our Structure', path: '/structure', menu_order: 30 },
                { label: 'Corporate Governance', path: '/governance', menu_order: 40 },
                { label: 'Awards & Recognition', path: '/awards', menu_order: 50 },
                { label: 'CSR', path: '/csr', menu_order: 60 },
            ]
        },
        {
            id: 'what-we-do',
            label: 'What We Do',
            path: '/projects',
            menu_order: 20,
            dropdown: [
                { label: 'Cablecar and Hotel', path: '/projects', menu_order: 10 },
            ]
        },
        {
            id: 'investors',
            label: 'Investors',
            path: '/investors',
            menu_order: 30,
            dropdown: [
                { label: 'Financial Reports', path: '/investors', menu_order: 10 },
                { label: 'Basic Shareholder', path: '/basic-shareholders', menu_order: 20 },
                { label: 'IPO', path: '/ipo', menu_order: 30 },
            ]
        },
        { label: 'Progress Stories', path: '/progress', menu_order: 40 },
        { label: 'Associates', path: '/associates', menu_order: 50 },
        { label: 'Downloads', path: '/downloads', menu_order: 60 },
        { label: 'Media Center', path: '/media', menu_order: 70 },
    ];

    // Merge and sort all navigation items
    const allNavItems = baseNavItems.map(item => ({
        ...item,
        dropdown: item.dropdown ? item.dropdown.map(d => ({ ...d })) : undefined
    }));

    customNavItems.forEach(item => {
        const navItem = {
            label: item.title,
            path: `/${item.slug}`,
            menu_order: item.menu_order || 100
        };

        if (item.parent_menu) {
            // Find parent and append
            const parent = allNavItems.find(p => p.id === item.parent_menu);
            if (parent) {
                if (!parent.dropdown) parent.dropdown = [];
                parent.dropdown.push(navItem);
                // Sort dropdown items
                parent.dropdown.sort((a, b) => (a.menu_order || 100) - (b.menu_order || 100));
            } else {
                // Fallback to top level if parent not found
                allNavItems.push(navItem);
            }
        } else {
            allNavItems.push(navItem);
        }
    });

    // Add Contact
    allNavItems.push({ label: 'Contact', path: '/contact', menu_order: 1000 });

    // Sort top-level items
    allNavItems.sort((a, b) => (a.menu_order || 100) - (b.menu_order || 100));

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const openingHours = settings?.opening_hours || {
        weekday: 'Sun - Fri: 07:30 AM – 06:15 PM',
        weekend: 'Sat-Sun: 07:30 AM – 18:15 PM'
    };

    return (
        <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
            {/* Top Bar */}
            <div className="topbar">
                <div className="container">
                    <div className="topbar-content">
                        <div className="topbar-left">
                            <a href={`mailto:${settings?.contact_email || 'info@bandipurcablecar.com.np'}`} className="topbar-item">
                                <Mail size={14} />
                                <span>{settings?.contact_email || 'info@bandipurcablecar.com.np'}</span>
                            </a>
                        </div>
                        <div className="topbar-right">
                            <div className="topbar-item">
                                <Clock size={14} />
                                <span>{openingHours.weekday}</span>
                            </div>
                            <div className="topbar-social">
                                <a href={settings?.social_links?.facebook || '#'} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a href={settings?.social_links?.youtube || '#'} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                                <a href={settings?.social_links?.tiktok || 'https://www.tiktok.com/@bandipurhill'} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="navbar">
                <div className="container">
                    <div className="navbar-content">
                        <Link to="/" className="logo">
                            <img
                                src={settings?.logo_url || '/logo.png'}
                                alt={settings?.company_name || 'Bandipur Cable Car'}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/logo.png';
                                }}
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <ul className="nav-menu">
                            {allNavItems.map((item, index) => (
                                <li
                                    key={index}
                                    className={`nav-item ${item.dropdown ? 'has-dropdown' : ''}`}
                                    onMouseEnter={() => item.dropdown && setActiveDropdown(index)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <Link to={item.path} className="nav-link">
                                        {item.label}
                                        {item.dropdown && <ChevronDown size={14} />}
                                    </Link>
                                    {item.dropdown && (
                                        <ul className={`dropdown-menu ${activeDropdown === index ? 'active' : ''}`}>
                                            {item.dropdown.map((subItem, subIndex) => (
                                                <li key={subIndex}>
                                                    <Link to={subItem.path} className="dropdown-link">
                                                        {subItem.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="mobile-toggle"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <ul className="mobile-nav">
                    {allNavItems.map((item, index) => (
                        <li key={index} className="mobile-nav-item">
                            {item.dropdown ? (
                                <>
                                    <button
                                        className="mobile-nav-link"
                                        onClick={() => toggleDropdown(index)}
                                    >
                                        {item.label}
                                        <ChevronDown
                                            size={16}
                                            className={`dropdown-icon ${activeDropdown === index ? 'rotated' : ''}`}
                                        />
                                    </button>
                                    <ul className={`mobile-dropdown ${activeDropdown === index ? 'active' : ''}`}>
                                        {item.dropdown.map((subItem, subIndex) => (
                                            <li key={subIndex}>
                                                <Link to={subItem.path} className="mobile-dropdown-link">
                                                    {subItem.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <Link to={item.path} className="mobile-nav-link">
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
}
