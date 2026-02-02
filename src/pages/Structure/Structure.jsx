import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useSettings, useTeamMembers } from '../../hooks/useData';
import { Building2, Users, Award, ChevronRight, X } from 'lucide-react';
import './Structure.css';

export default function Structure() {
    const { settings } = useSettings();
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 800, once: true, offset: 100 });
    }, []);

    const { members, loading } = useTeamMembers();
    const boardMembers = members.filter(m => m.type === 'board').sort((a, b) => a.display_order - b.display_order);
    const managementMembers = members.filter(m => m.type === 'management').sort((a, b) => a.display_order - b.display_order);

    return (
        <main className="structure-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-bg" style={{
                    backgroundImage: `url(https://bandipurcablecar.com.np/assets/img/banner-1.jpeg)`
                }}></div>
                <div className="page-hero-overlay"></div>
                <div className="container">
                    <div className="page-hero-content" data-aos="fade-up">
                        <span className="page-hero-subtitle">Who We Are</span>
                        <h1 className="page-hero-title">Our Structure</h1>
                        <p className="page-hero-description">
                            Leadership committed to excellence
                        </p>
                    </div>
                </div>
            </section>

            {/* Chairman's Message */}
            <section className="section">
                <div className="container">
                    <div className="chairman-section">
                        <div className="chairman-image" data-aos="fade-right">
                            <img
                                src="/team/chairman.png"
                                alt="Chairman"
                            />
                        </div>
                        <div className="chairman-content" data-aos="fade-left">
                            <span className="section-subtitle" style={{ marginLeft: 0 }}>अध्यक्षको सन्देश</span>
                            <h2 className="section-title" style={{ textAlign: 'left' }}>Chairman's Message</h2>
                            <div className="chairman-message">
                                <p>
                                    आदरणीय शेयरधनी महानुभावहरु,
                                    नेपाल सरकारका सम्माननीय प्रतिनिधिहरु, नेपाल धितोपत्र बोर्ड, नेपाल स्टक एक्सचेन्ज तथा अन्य नियामक निकायका विशिष्ट सदस्यहरू, सञ्चालक समिति, लेखा परीक्षकज्यूहरू, आम समय-अनुशासन पालना गर्दै उपस्थित हुनु भएका अतिथिगण र बन्दीपुर केबलकार एंड टुरिजम लिमिटेड परिवारका समर्पित सहकर्मीहरू, आज हामी कम्पनीको पाँचौं वार्षिक साधारण सभाको अवसरमा एकत्रित भएका छौं । म अध्यक्षको हैसियतले आजको औपचारिक सभामा उपस्थित हुनुभएका सबै महानुभावहरुप्रति हार्दिक सम्मान, आभार र स्वागत व्यक्त गर्न चाहन्छु। कम्पनीको प्रगति, चुनौती, उपलब्धि र भविष्यको मार्गचित्र प्रस्तुत गर्न पाउँदा म अत्यन्त गौरवान्वित छु।
                                </p>
                                <p style={{ marginTop: '1rem' }}>
                                    हाम्रो संस्थागत पहिचान बन्दीपुर केबलकार एंड टुरिजम लिमिटेडको पाँच वर्षको यात्रा नेपालको पर्यटन क्षेत्रमा एउटा महत्वाकाङ्क्षी, योजनाबद्ध र भविष्य दृष्टि सम्पन्न पहलको सफल उदाहरण हो। हामीले सुरुवाती अवधिबाटै आधुनिक पूर्वाधार विकास, अनुभवजन्य पर्यटन विस्तार, सांस्कृतिक, धार्मिक तथा मनोरञ्जन आधारित सेवाको एकीकृत प्लेटफर्म र उच्च गुणस्तरमा आधारित दिगो व्यावसायिक सञ्चालनलाई हाम्रो संस्थागत दर्शनको केन्द्रमा राख्दै अघि बढेका थियौं।
                                </p>
                                <Link to="/chairman-message" className="read-more-link" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    marginTop: '1rem',
                                    color: '#e69138',
                                    fontWeight: '600',
                                    textDecoration: 'none'
                                }}>
                                    Show More <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Board of Directors */}
            <section className="section section-gray">
                <div className="container">
                    <div className="section-header" data-aos="fade-up">
                        <span className="section-subtitle">Leadership</span>
                        <h2 className="section-title">Board of Directors</h2>
                    </div>

                    <div className="team-grid">
                        {boardMembers.map((member, index) => (
                            <div
                                key={index}
                                className="team-card clickable"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                onClick={() => setSelectedMember(member)}
                            >
                                {member.image_url ? (
                                    <img
                                        src={member.image_url}
                                        alt={member.name}
                                        className="team-image"
                                    />
                                ) : (
                                    <div className="team-avatar">
                                        {member.name.split(' ').map((n, i) => i < 2 ? n[0] : '').join('')}
                                    </div>
                                )}
                                <h3 className="team-name">{member.name}</h3>
                                <span className="team-position">{member.position}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Management Committee */}
            <section className="section">
                <div className="container">
                    <div className="section-header" data-aos="fade-up">
                        <span className="section-subtitle">Team</span>
                        <h2 className="section-title">Management Committee</h2>
                    </div>

                    <div className="team-grid" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {managementMembers.map((member, index) => (
                            <div
                                key={index}
                                className="team-card clickable"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                style={{ flex: '0 1 250px' }} // Approx width of grid item
                                onClick={() => setSelectedMember(member)}
                            >
                                {member.image_url ? (
                                    <img
                                        src={member.image_url}
                                        alt={member.name}
                                        className="team-image"
                                    />
                                ) : (
                                    <div className="team-avatar">
                                        {member.name.split(' ').map((n, i) => i < 2 ? n[0] : '').join('')}
                                    </div>
                                )}
                                <h3 className="team-name">{member.name}</h3>
                                <span className="team-position">{member.position}</span>
                            </div>
                        ))}
                        {managementMembers.length === 0 && (
                            <div className="text-center w-full">
                                <p className="text-gray-500">No management team members added yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Member Detail Modal */}
            {selectedMember && (
                <div className="member-modal-overlay" onClick={() => setSelectedMember(null)}>
                    <div className="member-modal" onClick={e => e.stopPropagation()}>
                        <button className="member-modal-close" onClick={() => setSelectedMember(null)}>
                            <X size={24} />
                        </button>
                        <div className="member-modal-content">
                            <div className="member-modal-image-wrapper">
                                {selectedMember.image_url ? (
                                    <img
                                        src={selectedMember.image_url}
                                        alt={selectedMember.name}
                                        className="member-modal-image"
                                    />
                                ) : (
                                    <div className="member-modal-avatar">
                                        {selectedMember.name.split(' ').map((n, i) => i < 2 ? n[0] : '').join('')}
                                    </div>
                                )}
                            </div>
                            <div className="member-modal-info">
                                <h2 className="member-modal-name">{selectedMember.name}</h2>
                                <p className="member-modal-position">{selectedMember.position}</p>
                                <div className="member-modal-divider"></div>
                                {selectedMember.bio ? (
                                    <div className="member-modal-bio">
                                        {selectedMember.bio.split('\n').map((line, i) => (
                                            <p key={i}>{line}</p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="member-modal-bio-placeholder">
                                        No Bio or Qualification details available.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Organizational Structure */}
            <section className="section section-gray">
                <div className="container">
                    <div className="section-header" data-aos="fade-up">
                        <span className="section-subtitle">Organization</span>
                        <h2 className="section-title">Organizational Structure</h2>
                    </div>

                    <div className="org-structure" data-aos="fade-up">
                        <img
                            src="https://placehold.co/800x600?text=Org+Structure+Image+Pending"
                            alt="Organizational Structure"
                            className="org-image"
                        />
                    </div>
                </div>
            </section>

            {/* Company Info */}
            <section className="section">
                <div className="container">
                    <div className="info-grid">
                        <div className="info-card" data-aos="fade-up">
                            <div className="info-icon">
                                <Building2 size={32} />
                            </div>
                            <h3>Registration</h3>
                            <p>Company Registrar Office, Kathmandu<br />Reg. No. 270364/078/079<br />PAN: 600918925</p>
                        </div>
                        <div className="info-card" data-aos="fade-up" data-aos-delay="100">
                            <div className="info-icon">
                                <Users size={32} />
                            </div>
                            <h3>Employees</h3>
                            <p>50+ dedicated professionals working across our field and corporate offices</p>
                        </div>
                        <div className="info-card" data-aos="fade-up" data-aos-delay="200">
                            <div className="info-icon">
                                <Award size={32} />
                            </div>
                            <h3>Rating</h3>
                            <p>CARE-NP BBB (Is) Rating by CARE Ratings Nepal Limited</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
