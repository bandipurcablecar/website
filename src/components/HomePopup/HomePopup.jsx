import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePopup() {
    const [popups, setPopups] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        fetchActivePopups();
    }, []);

    async function fetchActivePopups() {
        try {
            const { data, error } = await supabase
                .from('popups')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (data && data.length > 0) {
                setPopups(data);
                setIsVisible(true);
            }
        } catch (error) {
            console.error('Error fetching popups:', error);
        }
    }

    function handleClose() {
        if (currentIndex < popups.length - 1) {
            // Show next popup
            setCurrentIndex(prev => prev + 1);
        } else {
            // No more popups
            setIsVisible(false);
        }
    }

    if (!isVisible || popups.length === 0) return null;

    const popup = popups[currentIndex];

    return (
        <div className="home-popup-overlay">
            <div className="home-popup-content" data-aos="zoom-in" key={popup.id}>
                <button
                    className="popup-close-btn"
                    onClick={handleClose}
                >
                    <X size={24} />
                    {popups.length > 1 && (
                        <span className="popup-count-badge">
                            {currentIndex + 1}/{popups.length}
                        </span>
                    )}
                </button>

                <div className="popup-body">
                    {popup.title && (
                        <h3 style={{
                            color: 'white',
                            textAlign: 'center',
                            marginBottom: '1rem',
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                        }}>
                            {popup.title}
                        </h3>
                    )}
                    {popup.link_url ? (
                        <Link to={popup.link_url} onClick={() => setIsVisible(false)}>
                            <img src={popup.image_url} alt={popup.title || 'Announcement'} />
                        </Link>
                    ) : (
                        <img src={popup.image_url} alt={popup.title || 'Announcement'} />
                    )}
                </div>
            </div>

            <style>{`
                .home-popup-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.75);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    backdrop-filter: blur(4px);
                }
                .home-popup-content {
                    position: relative;
                    background: transparent;
                    max-width: 600px;
                    width: 100%;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                }
                .popup-close-btn {
                    position: absolute;
                    top: -15px;
                    right: -15px;
                    background: white;
                    color: black;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
                    border: none;
                    cursor: pointer;
                    z-index: 10;
                    transition: all 0.2s;
                }
                .popup-close-btn:hover {
                    transform: scale(1.1);
                    background: #f3f4f6;
                }
                .popup-count-badge {
                    position: absolute;
                    bottom: -25px;
                    right: 0;
                    background: rgba(0,0,0,0.6);
                    color: white;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    white-space: nowrap;
                }
                .popup-body img {
                    width: 100%;
                    height: auto;
                    max-height: 80vh;
                    object-fit: contain;
                    border-radius: 8px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
                }
            `}</style>
        </div>
    );
}
