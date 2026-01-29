import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePopup() {
    const [popup, setPopup] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        fetchActivePopup();
    }, []);

    async function fetchActivePopup() {
        try {
            const { data, error } = await supabase
                .from('popups')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true })
                .limit(1)
                .single();

            if (data) {
                setPopup(data);
                setIsVisible(true);
            }
        } catch (error) {
            // No active popup or error
        }
    }

    if (!popup || !isVisible) return null;

    return (
        <div className="home-popup-overlay">
            <div className="home-popup-content" data-aos="zoom-in">
                <button
                    className="popup-close-btn"
                    onClick={() => setIsVisible(false)}
                >
                    <X size={24} />
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
