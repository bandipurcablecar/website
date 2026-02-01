import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Upload, Image as ImageIcon, Save, X, ExternalLink, ToggleLeft, ToggleRight, Layout } from 'lucide-react';

export default function AdminHome() {
    const [activeTab, setActiveTab] = useState('hero'); // hero, popup, marquee

    // Hero State
    const [slides, setSlides] = useState([]);
    const [loadingSlides, setLoadingSlides] = useState(true);
    const [savingSlides, setSavingSlides] = useState(false);

    // Popup State
    const [popups, setPopups] = useState([]);
    const [loadingPopups, setLoadingPopups] = useState(true);
    const [showPopupForm, setShowPopupForm] = useState(false);

    const [newPopup, setNewPopup] = useState({
        id: null,
        title: '',
        link_url: '',
        image: null,
        display_order: 0,
        image_source_type: 'upload', // 'upload' or 'link'
        direct_image_url: ''
    });

    // Marquee State
    const [marqueeItems, setMarqueeItems] = useState([]);
    const [savingMarquee, setSavingMarquee] = useState(false);

    useEffect(() => {
        fetchSlides();
        fetchPopups();
        fetchMarqueeItems();
    }, []);

    // --- Hero Slider Logic ---
    async function fetchSlides() {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('hero_slides')
                .single();

            if (error) throw error;
            setSlides(data.hero_slides || []);
        } catch (error) {
            console.error('Error fetching slides:', error);
        } finally {
            setLoadingSlides(false);
        }
    }

    async function handleSlideChange(index, field, value) {
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], [field]: value };
        setSlides(newSlides);
    }

    async function handleSlideImageUpload(index, file) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `hero_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('banners')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('banners')
                .getPublicUrl(filePath);

            handleSlideChange(index, 'image', publicUrl);
        } catch (error) {
            console.error('Error uploading slide image:', error);
            alert('Failed to upload image');
        }
    }

    async function addSlide() {
        setSlides([...slides, { title: '', subtitle: '', image: '', description: '' }]);
    }

    async function removeSlide(index) {
        if (!confirm('Remove this slide?')) return;
        const newSlides = slides.filter((_, i) => i !== index);
        setSlides(newSlides);
    }

    async function saveSlides() {
        setSavingSlides(true);
        try {
            const { error } = await supabase
                .from('site_settings')
                .update({ hero_slides: slides })
                .eq('id', 1);

            if (error) throw error;
            alert('Carousel updated successfully!');
        } catch (error) {
            console.error('Error saving slides:', error);
            alert('Failed to save changes');
        } finally {
            setSavingSlides(false);
        }
    }

    // --- Popup Logic ---
    async function fetchPopups() {
        try {
            const { data, error } = await supabase
                .from('popups')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setPopups(data || []);
        } catch (error) {
            console.error('Error fetching popups:', error);
        } finally {
            setLoadingPopups(false);
        }
    }

    // --- Marquee Logic ---
    async function fetchMarqueeItems() {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('marquee_content')
                .eq('id', 1)
                .single();

            if (error) throw error;
            setMarqueeItems(data.marquee_content || []);
        } catch (error) {
            console.error('Error fetching marquee items:', error);
            // Default to empty if column missing or error
            // setMarqueeItems([]); 
        }
    }

    async function saveMarqueeItems(itemsToSave) {
        setSavingMarquee(true);
        try {
            const { error } = await supabase
                .from('site_settings')
                .update({ marquee_content: itemsToSave })
                .eq('id', 1);

            if (error) throw error;
            setMarqueeItems(itemsToSave);
            alert('Marquee items saved!');
        } catch (error) {
            console.error('Error saving marquee items:', error);
            alert('Failed to save changes. Make sure you have run the migration SQL.');
        } finally {
            setSavingMarquee(false);
        }
    }

    function addMarqueeItem() {
        const newItem = {
            id: Date.now(),
            title: '',
            link_url: '',
            is_active: true
        };
        const updated = [newItem, ...marqueeItems];
        setMarqueeItems(updated);
    }

    function updateMarqueeItem(index, field, value) {
        const updated = [...marqueeItems];
        updated[index] = { ...updated[index], [field]: value };
        setMarqueeItems(updated);
    }

    function removeMarqueeItem(index) {
        if (!confirm("Remove this item?")) return;
        const updated = marqueeItems.filter((_, i) => i !== index);
        setMarqueeItems(updated);
    }

    async function handlePopupUpload(e) {
        e.preventDefault();

        try {
            let imageUrl = null;

            if (newPopup.image_source_type === 'upload') {
                // Upload Image if selected
                if (newPopup.image) {
                    const fileExt = newPopup.image.name.split('.').pop();
                    const fileName = `popup_${Date.now()}.${fileExt}`;
                    const { error: uploadError } = await supabase.storage
                        .from('popups')
                        .upload(fileName, newPopup.image);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('popups')
                        .getPublicUrl(fileName);

                    imageUrl = publicUrl;
                }
            } else {
                // Use Direct Link
                imageUrl = newPopup.direct_image_url;
            }

            if (newPopup.id) {
                // Update existing popup
                const updates = {
                    title: newPopup.title,
                    link_url: newPopup.link_url,
                    display_order: parseInt(newPopup.display_order) || 0
                };
                if (imageUrl) updates.image_url = imageUrl;

                const { error } = await supabase.from('popups').update(updates).eq('id', newPopup.id);
                if (error) throw error;
            } else {
                // Create new popup
                if (!imageUrl) return alert('Please select an image or provide a link');

                const { error } = await supabase.from('popups').insert([{
                    title: newPopup.title,
                    link_url: newPopup.link_url,
                    image_url: imageUrl,
                    display_order: parseInt(newPopup.display_order) || 0,
                    is_active: true
                }]);
                if (error) throw error;
            }

            setShowPopupForm(false);
            setNewPopup({
                id: null,
                title: '',
                link_url: '',
                image: null,
                display_order: 0,
                image_source_type: 'upload',
                direct_image_url: ''
            });
            fetchPopups();
        } catch (error) {
            console.error('Error saving popup:', error);
            alert('Failed to save popup');
        }
    }

    function openEditPopup(popup) {
        setNewPopup({
            id: popup.id,
            title: popup.title || '',
            link_url: popup.link_url || '',
            image: null,
            display_order: popup.display_order || 0,
            current_image: popup.image_url,
            image_source_type: 'upload', // Default to upload view, but keep current
            direct_image_url: ''
        });
        setShowPopupForm(true);
    }

    async function togglePopup(id, currentStatus) {
        try {
            const { error } = await supabase
                .from('popups')
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            fetchPopups();
        } catch (error) {
            console.error('Error toggling popup:', error);
        }
    }

    async function deletePopup(id) {
        if (!confirm('Delete this popup?')) return;
        try {
            const { error } = await supabase.from('popups').delete().eq('id', id);
            if (error) throw error;
            fetchPopups();
        } catch (error) {
            console.error('Error deleting popup:', error);
        }
    }

    return (
        <div className="admin-page">
            <h1 className="admin-page-title">Home Page Management</h1>

            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'hero' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hero')}
                >
                    <Layout size={18} /> Hero Carousel
                </button>
                <button
                    className={`admin-tab ${activeTab === 'popup' ? 'active' : ''}`}
                    onClick={() => setActiveTab('popup')}
                >
                    <ImageIcon size={18} /> Pop-ups
                </button>
                <button
                    className={`admin-tab ${activeTab === 'marquee' ? 'active' : ''}`}
                    onClick={() => setActiveTab('marquee')}
                >
                    <ExternalLink size={18} /> Marquee
                </button>
            </div>

            {/* --- HERO TAB --- */}
            {activeTab === 'hero' && (
                <div className="tab-content">
                    <div className="flex justify-between items-center mb-6">
                        <h2>Carousel Slides</h2>
                        <div className="flex gap-2">
                            <button className="btn btn-outline-primary" onClick={addSlide}>
                                <Plus size={18} /> Add Slide
                            </button>
                            <button className="btn btn-primary" onClick={saveSlides} disabled={savingSlides}>
                                <Save size={18} /> {savingSlides ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>

                    <div className="slides-grid">
                        {slides.map((slide, index) => (
                            <div key={index} className="admin-card slide-card">
                                <div className="slide-header">
                                    <span className="slide-number">Slide {index + 1}</span>
                                    <button className="btn-icon text-red-500" onClick={() => removeSlide(index)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Image Preview & Upload */}
                                <div className="slide-image-container">
                                    {slide.image ? (
                                        <img src={slide.image} alt="Slide" className="slide-preview" />
                                    ) : (
                                        <div className="slide-placeholder">No Image</div>
                                    )}
                                    <label className="image-upload-btn">
                                        <Upload size={14} /> Change Image
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(e) => handleSlideImageUpload(index, e.target.files[0])}
                                            accept="image/*"
                                        />
                                    </label>
                                </div>

                                <div className="form-group mt-4">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={slide.title || ''}
                                        onChange={(e) => handleSlideChange(index, 'title', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Subtitle</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={slide.subtitle || ''}
                                        onChange={(e) => handleSlideChange(index, 'subtitle', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description (Optional)</label>
                                    <textarea
                                        className="form-input"
                                        rows="2"
                                        value={slide.description || ''}
                                        onChange={(e) => handleSlideChange(index, 'description', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Link URL (Optional)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="/projects or https://..."
                                        value={slide.link || ''}
                                        onChange={(e) => handleSlideChange(index, 'link', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- POPUP TAB --- */}
            {activeTab === 'popup' && (
                <div className="tab-content">
                    <div className="flex justify-between items-center mb-6">
                        <h2>Website Pop-ups</h2>
                        <button className="btn btn-primary" onClick={() => {
                            setNewPopup({
                                id: null,
                                title: '',
                                link_url: '',
                                image: null,
                                display_order: 0,
                                image_source_type: 'upload',
                                direct_image_url: ''
                            });
                            setShowPopupForm(true);
                        }}>
                            <Plus size={18} /> New Pop-up
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {popups.map(popup => (
                            <div key={popup.id} className={`admin-card popup-card ${!popup.is_active ? 'opacity-75' : ''}`}>
                                <div className="popup-image-wrapper">
                                    <img src={popup.image_url} alt={popup.title} className="popup-preview-img" />
                                    <div className={`status-badge ${popup.is_active ? 'active' : 'inactive'}`}>
                                        {popup.is_active ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold mb-2">{popup.title || 'Untitled Popup'}</h3>
                                    <p className="text-sm text-gray-500 mb-2">Order: {popup.display_order}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => openEditPopup(popup)}>
                                            Edit
                                        </button>
                                        <button
                                            className="btn-icon"
                                            onClick={() => togglePopup(popup.id, popup.is_active)}
                                            title="Toggle Status"
                                        >
                                            {popup.is_active ? <ToggleRight size={24} className="text-green-600" /> : <ToggleLeft size={24} className="text-gray-400" />}
                                        </button>
                                        <button className="btn-icon text-red-500" onClick={() => deletePopup(popup.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {showPopupForm && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3>Add New Pop-up</h3>
                                    <button onClick={() => setShowPopupForm(false)}><X size={20} /></button>
                                </div>
                                <form onSubmit={handlePopupUpload}>
                                    <div className="form-group">
                                        <label>Pop-up Title</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={newPopup.title}
                                            onChange={e => setNewPopup({ ...newPopup, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Display Order (Lower shows first)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={newPopup.display_order}
                                            onChange={e => setNewPopup({ ...newPopup, display_order: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="mb-2 block">Image Source</label>
                                        <div className="flex gap-4 mb-3">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="source_type"
                                                    checked={newPopup.image_source_type === 'upload'}
                                                    onChange={() => setNewPopup({ ...newPopup, image_source_type: 'upload' })}
                                                /> Upload File
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="source_type"
                                                    checked={newPopup.image_source_type === 'link'}
                                                    onChange={() => setNewPopup({ ...newPopup, image_source_type: 'link' })}
                                                /> Direct Link URL
                                            </label>
                                        </div>

                                        {newPopup.current_image && !newPopup.image && !newPopup.direct_image_url && (
                                            <div className="mb-2 p-2 bg-gray-100 rounded border border-gray-200">
                                                <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                                                <img src={newPopup.current_image} alt="Current" className="h-20 w-auto object-contain" />
                                            </div>
                                        )}

                                        {newPopup.image_source_type === 'upload' ? (
                                            <input
                                                type="file"
                                                className="form-input"
                                                accept="image/*"
                                                required={!newPopup.id && newPopup.image_source_type === 'upload'}
                                                onChange={e => setNewPopup({ ...newPopup, image: e.target.files[0] })}
                                            />
                                        ) : (
                                            <input
                                                type="url"
                                                className="form-input"
                                                placeholder="https://example.com/image.jpg"
                                                value={newPopup.direct_image_url}
                                                required={!newPopup.id && newPopup.image_source_type === 'link'}
                                                onChange={e => setNewPopup({ ...newPopup, direct_image_url: e.target.value })}
                                            />
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Target Link (Optional)</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="/downloads"
                                            value={newPopup.link_url}
                                            onChange={e => setNewPopup({ ...newPopup, link_url: e.target.value })}
                                        />
                                    </div>
                                    <div className="modal-footer mt-6 flex justify-end gap-2">
                                        <button type="button" className="btn btn-outline-primary" onClick={() => setShowPopupForm(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">{newPopup.id ? 'Update' : 'Upload'} Popup</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- MARQUEE TAB --- */}
            {activeTab === 'marquee' && (
                <div className="tab-content">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2>Marquee Content</h2>
                            <p className="text-gray-500 text-sm mt-1">Manage scrolling news items independent of announcements.</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn btn-outline-primary" onClick={addMarqueeItem}>
                                <Plus size={18} /> Add Item
                            </button>
                            <button className="btn btn-primary" onClick={() => saveMarqueeItems(marqueeItems)} disabled={savingMarquee}>
                                <Save size={18} /> {savingMarquee ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>

                    <div className="admin-card">
                        {marqueeItems.length === 0 ? (
                            <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-100">
                                <ExternalLink size={24} className="mx-auto text-gray-400 mb-2" />
                                <p className="text-gray-500 mb-2">No marquee items yet.</p>
                                <p className="text-sm text-gray-400">Click "Add Item" to add news to the scrolling ticker.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {marqueeItems.map((item, index) => (
                                    <div key={item.id || index} className="flex gap-4 items-start p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="form-group">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Traffic Text</label>
                                                <input
                                                    type="text"
                                                    className="form-input w-full"
                                                    value={item.title}
                                                    onChange={(e) => updateMarqueeItem(index, 'title', e.target.value)}
                                                    placeholder="Enter news text..."
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Link URL (Optional)</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        className="form-input w-full pl-8"
                                                        value={item.link_url || ''}
                                                        onChange={(e) => updateMarqueeItem(index, 'link_url', e.target.value)}
                                                        placeholder="http://..."
                                                    />
                                                    <ExternalLink size={14} className="absolute left-2.5 top-3 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 pt-6">
                                            <button
                                                className={`p-2 rounded transition-colors ${item.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                                onClick={() => updateMarqueeItem(index, 'is_active', !item.is_active)}
                                                title={item.is_active ? "Active" : "Inactive"}
                                            >
                                                {item.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                            </button>
                                            <button
                                                className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                onClick={() => removeMarqueeItem(index)}
                                                title="Remove"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .admin-tabs {
                    display: flex;
                    gap: 1rem;
                    border-bottom: 2px solid #e5e7eb;
                    margin-bottom: 2rem;
                }
                .admin-tab {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    background: none;
                    border: none;
                    border-bottom: 2px solid transparent;
                    margin-bottom: -2px;
                    color: #6b7280;
                    font-weight: 500;
                    cursor: pointer;
                }
                .admin-tab:hover { color: var(--color-primary); }
                .admin-tab.active {
                    color: var(--color-primary);
                    border-bottom-color: var(--color-primary);
                }
                
                /* Slides Grid */
                .slides-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                }
                .slide-card {
                    overflow: hidden;
                    padding: 0 !important;
                }
                .slide-header {
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #f3f4f6;
                }
                .slide-number {
                    font-weight: 600;
                    color: #9ca3af;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                }
                .slide-image-container {
                    position: relative;
                    height: 160px;
                    background: #f9fafb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .slide-preview {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .image-upload-btn {
                    position: absolute;
                    bottom: 0.5rem;
                    right: 0.5rem;
                    background: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }
                .slide-card .form-group {
                    padding: 0 1rem 1rem 1rem;
                }
                .slide-card .form-group:first-of-type {
                    padding-top: 1rem;
                }

                /* Popup Card */
                .popup-image-wrapper {
                    position: relative;
                    height: 200px;
                    background: #1f2937;
                }
                .popup-preview-img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                .status-badge {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: bold;
                }
                .status-badge.active { background: #dcfce7; color: #166534; }
                .status-badge.active { background: #dcfce7; color: #166534; }
                .status-badge.inactive { background: #fee2e2; color: #991b1b; }

                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.7);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal-content {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                    color: #1f2937;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .modal-header h3 {
                    font-size: 1.25rem;
                    font-weight: bold;
                }

            `}</style>
        </div>
    );
}
