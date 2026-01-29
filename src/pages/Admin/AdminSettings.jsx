import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, RefreshCw, Upload, Trash2, Plus } from 'lucide-react';

export default function AdminSettings() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    async function handleLogoUpload(e) {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `logos/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(fileName);

            handleChange('logo_url', publicUrl);
            setMessage({ type: 'success', text: 'Logo uploaded successfully! Click Save to persist changes.' });
        } catch (error) {
            console.error('Error uploading logo:', error);
            setMessage({ type: 'error', text: 'Failed to upload logo. Make sure you have permission.' });
        } finally {
            setUploading(false);
        }
    }

    async function handleAboutImageUpload(e) {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `about/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(fileName);

            handleChange('about_image_url', publicUrl);
            setMessage({ type: 'success', text: 'About image uploaded successfully! Click Save to persist changes.' });
        } catch (error) {
            console.error('Error uploading about image:', error);
            setMessage({ type: 'error', text: 'Failed to upload about image.' });
        } finally {
            setUploading(false);
        }
    }

    async function handleHomeAboutImageUpload(e, key) {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `home/${key}_${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(fileName);

            handleHomeAboutChange(key, publicUrl);
            setMessage({ type: 'success', text: 'Image uploaded successfully! Click Save to persist.' });
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage({ type: 'error', text: 'Failed to upload image.' });
        } finally {
            setUploading(false);
        }
    }

    function handleHomeAboutChange(key, value) {
        setSettings(prev => ({
            ...prev,
            home_about: { ...(prev.home_about || {}), [key]: value }
        }));
    }

    async function fetchSettings() {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .single();

            if (error) throw error;
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setMessage({ type: 'error', text: 'Failed to load settings' });
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase
                .from('site_settings')
                .update({
                    company_name: settings.company_name,
                    logo_url: settings.logo_url,
                    contact_email: settings.contact_email,
                    contact_phone: settings.contact_phone,
                    about_image_url: settings.about_image_url || null,
                    about_excerpt: settings.about_excerpt,
                    about_content: settings.about_content,
                    about_nepali: settings.about_nepali,
                    quick_links: settings.quick_links,
                    home_about: settings.home_about || {},
                    progress_hero_image: settings.progress_hero_image || null,
                    company_overview: settings.company_overview || {},
                    chairman_message: settings.chairman_message,
                    ceo_message: settings.ceo_message,
                    social_links: settings.social_links,
                    opening_hours: settings.opening_hours,
                    field_office: settings.field_office,
                    corporate_office: settings.corporate_office,
                    capital_info: settings.capital_info,
                    care_rating: settings.care_rating,
                    footer_text: settings.footer_text,
                    updated_at: new Date().toISOString()
                })
                .eq('id', 1);

            if (error) throw error;
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    }

    function handleChange(field, value) {
        setSettings(prev => ({ ...prev, [field]: value }));
    }

    function handleNestedChange(field, key, value) {
        setSettings(prev => ({
            ...prev,
            [field]: { ...prev[field], [key]: value }
        }));
    }

    function handleQuickLinkChange(index, key, value) {
        const newLinks = [...(settings?.quick_links || [])];
        if (!newLinks[index]) newLinks[index] = {};
        newLinks[index][key] = value;
        handleChange('quick_links', newLinks);
    }

    function addQuickLink() {
        const newLinks = [...(settings?.quick_links || []), { label: '', url: '' }];
        handleChange('quick_links', newLinks);
    }

    function removeQuickLink(index) {
        const newLinks = [...(settings?.quick_links || [])];
        newLinks.splice(index, 1);
        handleChange('quick_links', newLinks);
    }

    async function handleProgressHeroUpload(e) {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `progress/hero_${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(fileName);

            handleChange('progress_hero_image', publicUrl);
            setMessage({ type: 'success', text: 'Image uploaded successfully! Click Save to persist.' });
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage({ type: 'error', text: 'Failed to upload image.' });
        } finally {
            setUploading(false);
        }
    }

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="admin-settings">
            <div className="admin-page-header">
                <h1 className="admin-page-title">Site Settings</h1>
                <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? <RefreshCw size={18} className="spin" /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {message.text && (
                <div className={`admin-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave}>
                {/* General Settings */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">General Information</h2>
                    </div>

                    <div className="form-grid">
                        <div className="form-group form-full">
                            <label className="form-label">Logo (Image or MP4 Video)</label>

                            {/* Upload Section */}
                            <div className="logo-upload-section" style={{ marginBottom: '1rem' }}>
                                <label
                                    className={`upload-btn ${uploading ? 'disabled' : ''}`}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#f3f4f6',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        cursor: uploading ? 'not-allowed' : 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        color: '#374151',
                                        marginBottom: '0.5rem'
                                    }}
                                >
                                    <Upload size={16} />
                                    <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                                    <input
                                        type="file"
                                        accept="image/*,video/mp4"
                                        onChange={handleLogoUpload}
                                        disabled={uploading}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                                <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
                                    (Max 5MB recommended)
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={settings?.logo_url || ''}
                                    onChange={(e) => handleChange('logo_url', e.target.value)}
                                    placeholder="https://.../logo.png or .../logo.mp4"
                                />
                            </div>
                            <p className="form-help-text" style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                Enter a URL or upload a file. If you use an <strong>.mp4</strong> file, it will play endlessly as a video logo.
                            </p>

                            {/* Preview */}
                            {settings?.logo_url && (
                                <div style={{ marginTop: '10px' }}>
                                    <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Preview:</p>
                                    {settings.logo_url.toLowerCase().endsWith('.mp4') ? (
                                        <video
                                            src={settings.logo_url}
                                            style={{ height: '60px', borderRadius: '4px', objectFit: 'cover' }}
                                            autoPlay
                                            loop
                                            muted
                                        />
                                    ) : (
                                        <img
                                            src={settings.logo_url}
                                            alt="Logo Preview"
                                            style={{ height: '60px', borderRadius: '4px', objectFit: 'contain' }}
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="form-group form-full">
                            <label className="form-label">Favicon (Browser Tab Icon)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.social_links?.favicon || ''}
                                onChange={(e) => handleNestedChange('social_links', 'favicon', e.target.value)}
                                placeholder="https://.../favicon.png"
                            />
                            <p className="form-help-text" style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                Recommended: 32x32px or 64x64px PNG image. (Required if Logo is a video)
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Company Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.company_name || ''}
                                onChange={(e) => handleChange('company_name', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Contact Email</label>
                            <input
                                type="email"
                                className="form-input"
                                value={settings?.contact_email || ''}
                                onChange={(e) => handleChange('contact_email', e.target.value)}
                            />
                        </div>
                        <div className="form-group form-full">
                            <label className="form-label">About Page Image</label>
                            <div className="logo-upload-section" style={{ marginBottom: '1rem' }}>
                                <label
                                    className={`upload-btn ${uploading ? 'disabled' : ''}`}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#f3f4f6',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        cursor: uploading ? 'not-allowed' : 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        color: '#374151',
                                        marginBottom: '0.5rem'
                                    }}
                                >
                                    <Upload size={16} />
                                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAboutImageUpload}
                                        disabled={uploading}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.about_image_url || ''}
                                onChange={(e) => handleChange('about_image_url', e.target.value)}
                                placeholder="https://..."
                            />
                            {settings?.about_image_url && (
                                <div style={{ marginTop: '10px' }}>
                                    <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Preview:</p>
                                    <img
                                        src={settings.about_image_url}
                                        alt="About Preview"
                                        style={{ height: '100px', borderRadius: '4px', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="form-group form-full">
                            <label className="form-label">About Excerpt (English - Short)</label>
                            <textarea
                                className="form-textarea"
                                value={settings?.about_excerpt || ''}
                                onChange={(e) => handleChange('about_excerpt', e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className="form-group form-full">
                            <label className="form-label">About Page Content (English - Full)</label>
                            <textarea
                                className="form-textarea"
                                value={settings?.about_content || ''}
                                onChange={(e) => handleChange('about_content', e.target.value)}
                                rows={8}
                            />
                        </div>
                        <div className="form-group form-full">
                            <label className="form-label">About (Nepali)</label>
                            <textarea
                                className="form-textarea"
                                value={settings?.about_nepali || ''}
                                onChange={(e) => handleChange('about_nepali', e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div className="form-group form-full">
                            <label className="form-label">Chairman Message</label>
                            <textarea
                                className="form-textarea"
                                value={settings?.chairman_message || ''}
                                onChange={(e) => handleChange('chairman_message', e.target.value)}
                                rows={6}
                            />
                        </div>
                        <div className="form-group form-full">
                            <label className="form-label">CEO Message</label>
                            <textarea
                                className="form-textarea"
                                value={settings?.ceo_message || ''}
                                onChange={(e) => handleChange('ceo_message', e.target.value)}
                                rows={6}
                                placeholder="HTML content for the CEO Message page..."
                            />
                        </div>
                    </div>
                </div>

                {/* Home Page About Section */}
                <div className="admin-card" style={{ marginTop: 'var(--spacing-6)' }}>
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">Home Page "About Us" Section</h2>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.home_about?.title || ''}
                                onChange={(e) => handleHomeAboutChange('title', e.target.value)}
                                placeholder="e.g. Cable Car With Tourism"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Experience Count</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.home_about?.experience_count || ''}
                                onChange={(e) => handleHomeAboutChange('experience_count', e.target.value)}
                                placeholder="e.g. 45+"
                            />
                        </div>
                        <div className="form-group form-full">
                            <label className="form-label">Experience Text</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.home_about?.experience_text || ''}
                                onChange={(e) => handleHomeAboutChange('experience_text', e.target.value)}
                                placeholder="e.g. Years Combined Experience"
                            />
                        </div>

                        {/* Image 1 */}
                        <div className="form-group">
                            <label className="form-label">Main Image (Large)</label>
                            <div className="logo-upload-section" style={{ marginBottom: '0.5rem' }}>
                                <label className={`upload-btn ${uploading ? 'disabled' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', cursor: uploading ? 'not-allowed' : 'pointer' }}>
                                    <Upload size={16} /> <span>Upload</span>
                                    <input type="file" accept="image/*" onChange={(e) => handleHomeAboutImageUpload(e, 'image_1')} disabled={uploading} style={{ display: 'none' }} />
                                </label>
                            </div>
                            <input type="text" className="form-input" value={settings?.home_about?.image_1 || ''} onChange={(e) => handleHomeAboutChange('image_1', e.target.value)} placeholder="Image URL" />
                            {settings?.home_about?.image_1 && <img src={settings.home_about.image_1} alt="Preview" style={{ marginTop: '5px', height: '60px', borderRadius: '4px' }} />}
                        </div>

                        {/* Image 2 */}
                        <div className="form-group">
                            <label className="form-label">Secondary Image (Small)</label>
                            <div className="logo-upload-section" style={{ marginBottom: '0.5rem' }}>
                                <label className={`upload-btn ${uploading ? 'disabled' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', cursor: uploading ? 'not-allowed' : 'pointer' }}>
                                    <Upload size={16} /> <span>Upload</span>
                                    <input type="file" accept="image/*" onChange={(e) => handleHomeAboutImageUpload(e, 'image_2')} disabled={uploading} style={{ display: 'none' }} />
                                </label>
                            </div>
                            <input type="text" className="form-input" value={settings?.home_about?.image_2 || ''} onChange={(e) => handleHomeAboutChange('image_2', e.target.value)} placeholder="Image URL" />
                            {settings?.home_about?.image_2 && <img src={settings.home_about.image_2} alt="Preview" style={{ marginTop: '5px', height: '60px', borderRadius: '4px' }} />}
                        </div>

                        {/* Features */}
                        <div className="form-group form-full">
                            <label className="form-label">Features (Comma Separated)</label>
                            <textarea
                                className="form-textarea"
                                value={settings?.home_about?.features_list || ''}
                                onChange={(e) => handleHomeAboutChange('features_list', e.target.value)}
                                rows={2}
                                placeholder="e.g. Complete Holiday Package, Sky Cycling & Zipline, Drive-inn Restaurant"
                            />
                            <p className="form-help-text" style={{ fontSize: '12px', color: '#666' }}>Enter features separated by commas.</p>
                        </div>
                    </div>
                </div>

                {/* Progress Page Settings */}
                <div className="admin-card" style={{ marginTop: 'var(--spacing-6)' }}>
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">Progress Page Settings</h2>
                    </div>
                    <div className="form-grid">
                        <div className="form-group form-full">
                            <label className="form-label">Hero Background Image</label>
                            <div className="logo-upload-section" style={{ marginBottom: '0.5rem' }}>
                                <label className={`upload-btn ${uploading ? 'disabled' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', cursor: uploading ? 'not-allowed' : 'pointer' }}>
                                    <Upload size={16} /> <span>Upload</span>
                                    <input type="file" accept="image/*" onChange={handleProgressHeroUpload} disabled={uploading} style={{ display: 'none' }} />
                                </label>
                            </div>
                            <input type="text" className="form-input" value={settings?.progress_hero_image || ''} onChange={(e) => handleChange('progress_hero_image', e.target.value)} placeholder="Image URL" />
                            {settings?.progress_hero_image && <img src={settings.progress_hero_image} alt="Preview" style={{ marginTop: '5px', height: '100px', borderRadius: '4px', objectFit: 'cover' }} />}
                        </div>
                    </div>
                </div>

                {/* Company Overview & Stats */}
                <div className="admin-card" style={{ marginTop: 'var(--spacing-6)' }}>
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">Company Overview & Stats</h2>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Promoter Share</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.company_overview?.promoter_share || ''}
                                onChange={(e) => handleNestedChange('company_overview', 'promoter_share', e.target.value)}
                                placeholder="e.g. 22,400,000"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Employee Count</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.company_overview?.employee_count || ''}
                                onChange={(e) => handleNestedChange('company_overview', 'employee_count', e.target.value)}
                                placeholder="e.g. 50+"
                            />
                        </div>
                        <div className="form-group form-full">
                            <label className="form-label">Subtitle (Small Text)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.company_overview?.subtitle || ''}
                                onChange={(e) => handleNestedChange('company_overview', 'subtitle', e.target.value)}
                                placeholder="e.g. Welcome to our company"
                            />
                        </div>
                        <div className="form-group form-full">
                            <label className="form-label">Title (Main Heading)</label>
                            <textarea
                                className="form-textarea"
                                value={settings?.company_overview?.title || ''}
                                onChange={(e) => handleNestedChange('company_overview', 'title', e.target.value)}
                                rows={2}
                                placeholder="e.g. Bandipur is a sovereign investor company..."
                            />
                        </div>
                        <div className="form-group form-full">
                            <label className="form-label">Audit Note</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.company_overview?.audit_note || ''}
                                onChange={(e) => handleNestedChange('company_overview', 'audit_note', e.target.value)}
                                placeholder="e.g. As Per Audit 2080/81"
                            />
                        </div>
                    </div>
                </div>

                {/* Capital Information */}
                <div className="admin-card" style={{ marginTop: 'var(--spacing-6)' }}>
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">Capital Information</h2>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Authorized Capital</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.capital_info?.authorized || ''}
                                onChange={(e) => handleNestedChange('capital_info', 'authorized', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Issued Capital</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.capital_info?.issued || ''}
                                onChange={(e) => handleNestedChange('capital_info', 'issued', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Paid-up Capital</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.capital_info?.paid_up || ''}
                                onChange={(e) => handleNestedChange('capital_info', 'paid_up', e.target.value)}
                            />
                        </div>
                        <div className="form-group form-full">
                            <label className="form-label">CARE Rating</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.care_rating || ''}
                                onChange={(e) => handleChange('care_rating', e.target.value)}
                                placeholder="e.g. CARE-NP BBB (Is)"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="admin-card" style={{ marginTop: 'var(--spacing-6)' }}>
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">Social Links</h2>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Facebook URL</label>
                            <input
                                type="url"
                                className="form-input"
                                value={settings?.social_links?.facebook || ''}
                                onChange={(e) => handleNestedChange('social_links', 'facebook', e.target.value)}
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">YouTube URL</label>
                            <input
                                type="url"
                                className="form-input"
                                value={settings?.social_links?.youtube || ''}
                                onChange={(e) => handleNestedChange('social_links', 'youtube', e.target.value)}
                                placeholder="https://youtube.com/..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">TikTok URL</label>
                            <input
                                type="url"
                                className="form-input"
                                value={settings?.social_links?.tiktok || ''}
                                onChange={(e) => handleNestedChange('social_links', 'tiktok', e.target.value)}
                                placeholder="https://tiktok.com/..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Instagram URL</label>
                            <input
                                type="url"
                                className="form-input"
                                value={settings?.social_links?.instagram || ''}
                                onChange={(e) => handleNestedChange('social_links', 'instagram', e.target.value)}
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Twitter / X URL</label>
                            <input
                                type="url"
                                className="form-input"
                                value={settings?.social_links?.twitter || ''}
                                onChange={(e) => handleNestedChange('social_links', 'twitter', e.target.value)}
                                placeholder="https://twitter.com/..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">LinkedIn URL</label>
                            <input
                                type="url"
                                className="form-input"
                                value={settings?.social_links?.linkedin || ''}
                                onChange={(e) => handleNestedChange('social_links', 'linkedin', e.target.value)}
                                placeholder="https://linkedin.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="admin-card" style={{ marginTop: 'var(--spacing-6)' }}>
                    <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 className="admin-card-title">Quick Links (Footer)</h2>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={addQuickLink} style={{ fontSize: '12px', padding: '4px 8px' }}>
                            <Plus size={14} /> Add Link
                        </button>
                    </div>

                    <div className="quick-links-list">
                        {(settings?.quick_links || []).map((link, index) => (
                            <div key={index} className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label" style={{ fontSize: '12px' }}>Label</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={link.label || ''}
                                        onChange={(e) => handleQuickLinkChange(index, 'label', e.target.value)}
                                        placeholder="Link Name"
                                    />
                                </div>
                                <div style={{ flex: 2 }}>
                                    <label className="form-label" style={{ fontSize: '12px' }}>URL</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={link.url || ''}
                                        onChange={(e) => handleQuickLinkChange(index, 'url', e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeQuickLink(index)}
                                    style={{
                                        color: 'var(--color-error)',
                                        padding: '10px',
                                        background: '#fee2e2',
                                        borderRadius: 'var(--radius-md)',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                    title="Remove Link"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {(!settings?.quick_links || settings.quick_links.length === 0) && (
                            <p style={{ color: '#666', fontStyle: 'italic', fontSize: '14px' }}>No quick links added. The default links will be used if left empty.</p>
                        )}
                    </div>
                </div>

                {/* Opening Hours */}
                <div className="admin-card" style={{ marginTop: 'var(--spacing-6)' }}>
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">Opening Hours</h2>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Weekday Hours</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.opening_hours?.weekday || ''}
                                onChange={(e) => handleNestedChange('opening_hours', 'weekday', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Weekend Hours</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.opening_hours?.weekend || ''}
                                onChange={(e) => handleNestedChange('opening_hours', 'weekend', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="admin-card" style={{ marginTop: 'var(--spacing-6)' }}>
                    <div className="admin-card-header">
                        <h2 className="admin-card-title">Footer</h2>
                    </div>

                    <div className="form-grid">
                        <div className="form-group form-full">
                            <label className="form-label">Footer Text (Rating Info)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings?.footer_text || ''}
                                onChange={(e) => handleChange('footer_text', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </form>

            <style>{`
        .admin-message {
          padding: var(--spacing-4);
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-6);
          font-weight: 500;
        }
        .admin-message.success {
          background-color: #d1fae5;
          color: #065f46;
        }
        .admin-message.error {
          background-color: #fee2e2;
          color: #991b1b;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
