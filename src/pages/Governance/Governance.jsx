import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Building2, Users, FileText, Scale, TrendingUp, AlertCircle } from 'lucide-react';
import './Governance.css';

const Governance = () => {
    useEffect(() => {
        AOS.init({ duration: 800, once: true, offset: 100 });
    }, []);

    return (
        <main className="governance-page">
            <section className="page-hero">
                <div className="page-hero-bg" style={{
                    backgroundImage: `url(https://bandipurcablecar.com.np/assets/img/banner-1.jpeg)`
                }}></div>
                <div className="page-hero-overlay"></div>
                <div className="container">
                    <div className="page-hero-content" data-aos="fade-up">
                        <span className="page-hero-subtitle">Corporate Governance</span>
                        <h1 className="page-hero-title">संस्थागत सुशासन सम्बन्धी वार्षिक अनुपालना प्रतिवेदन</h1>
                        <p className="page-hero-description">Annual Compliance Report on Corporate Governance</p>
                    </div>
                </div>
            </section>

            <div className="container section-padding">

                {/* Section 1: Company Details */}
                <div className="governance-card" data-aos="fade-up">
                    <div className="card-header">
                        <Building2 className="card-icon" />
                        <h3>१. कम्पनीको विवरण</h3>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="gov-table">
                                <tbody>
                                    <tr>
                                        <th width="30%">सूचिकृत संगठित संस्थाको नाम</th>
                                        <td><strong>बन्दीपुर केबलकार एण्ड टुरिजम लिमिटेड</strong></td>
                                    </tr>
                                    <tr>
                                        <th>ठेगाना (इमेल र वेबसाइट सहित)</th>
                                        <td>
                                            <div className="info-grid">
                                                <span><strong>रजिष्टर्ड कार्यालय:</strong> काठमाडौं महानगरपालिका- १३, कालीमाटी, काठमाडौं</span>
                                                <span><strong>फिल्ड कार्यालय:</strong> बन्दीपुर ४, तनहुँ</span>
                                                <span><strong>इमेल:</strong> <a href="mailto:information@bandipurhill.com">information@bandipurhill.com</a></span>
                                                <span><strong>वेबसाइट:</strong> <a href="https://www.bandipurhill.com" target="_blank" rel="noreferrer">www.bandipurhill.com</a></span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>फोन नं.</th>
                                        <td>०१-५२२४२५१, ०६५-५८०४५७</td>
                                    </tr>
                                    <tr>
                                        <th>प्रतिवेदन पेश गरिएको आ.व.</th>
                                        <td>२०८१/०८२ (२०८१/०४/०१ देखि २०८२/०३/३२ सम्मको विवरण)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Section 2: Board Composition */}
                <div className="governance-card" data-aos="fade-up">
                    <div className="card-header">
                        <Users className="card-icon" />
                        <h3>२. संचालक समिति सम्बन्धी विवरण</h3>
                    </div>
                    <div className="card-body">
                        <div className="highlight-box">
                            (क) संचालक समितिको अध्यक्षको नाम तथा नियुक्ति मिति: <strong>श्री रामचन्द्र शर्मा</strong>, २०८०/०३/२९ गते संचालक समितिको अध्यक्षमा नियुक्त ।
                        </div>

                        <h4 className="table-title">(ख) संस्थाको शेयर संरचना (संस्थापक, सर्वसाधारण तथा अन्य)</h4>
                        <div className="table-responsive">
                            <table className="gov-table">
                                <thead>
                                    <tr>
                                        <th>शेयरधनीको प्रकार</th>
                                        <th>शेयर संख्या</th>
                                        <th>प्रतिशत</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>संस्थापक</td>
                                        <td>२,२४,४०,०००</td>
                                        <td>७९.२९३२८६२२%</td>
                                    </tr>
                                    <tr>
                                        <td>साधारण</td>
                                        <td>५८,६०,०००</td>
                                        <td>२०.७०६७१३७५%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h4 className="table-title mt-6">(ग) संचालक समिति सम्बन्धी विवरण:</h4>
                        <div className="table-responsive">
                            <table className="gov-table">
                                <thead>
                                    <tr>
                                        <th>क्र. स.</th>
                                        <th>संचालकहरुको नाम</th>
                                        <th>प्रतिनिधित्व</th>
                                        <th>शेयर संख्या</th>
                                        <th>नियुक्ती मिति</th>
                                        <th>सपथ मिति</th>
                                        <th>नियुक्ती विधि</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { sn: '१', name: 'श्री रामचन्द्र शर्मा', type: 'संस्थापक', shares: '१८७,०००', date1: '२०८०/०३/२९', date2: '२०८०/०३/२९', method: 'वार्षिक साधारण सभाबाट नियुक्त' },
                                        { sn: '२', name: 'श्री शिव प्रसाद शर्मा*', type: 'संस्थापक', shares: '८७,७१०', date1: '२०८०/०३/२९', date2: '२०८०/०३/२९', method: 'वार्षिक साधारण सभाबाट नियुक्त' },
                                        { sn: '३', name: 'श्री तारानाथ उपाध्याय*', type: 'संस्थापक', shares: '२५,०००', date1: '२०८०/०३/२९', date2: '२०८०/०३/२९', method: 'वार्षिक साधारण सभाबाट नियुक्त' },
                                        { sn: '४', name: 'श्री कृष्णराज अधिकारी', type: 'संस्थापक', shares: '३२,०००', date1: '२०८०/०३/२९', date2: '२०८०/०३/२९', method: 'वार्षिक साधारण सभाबाट नियुक्त' },
                                        { sn: '५', name: 'श्री हरिदत्त पौडेल', type: 'संस्थापक', shares: '४३,५००', date1: '२०८०/०३/२९', date2: '२०८०/०३/२९', method: 'वार्षिक साधारण सभाबाट नियुक्त' },
                                        { sn: '६', name: 'श्री रना सापकोटा', type: 'संस्थापक', shares: '५५,०००', date1: '२०८०/०३/२९', date2: '२०८०/०३/२९', method: 'वार्षिक साधारण सभाबाट नियुक्त' },
                                        { sn: '७', name: 'श्री बाबुराम अर्याल', type: 'स्वतन्त्र', shares: 'नरहेको', date1: '२०८०/०३/२९', date2: '२०८०/०३/२९', method: 'वार्षिक साधारण सभाबाट नियुक्त' }
                                    ].map((row, i) => (
                                        <tr key={i}>
                                            <td>{row.sn}</td>
                                            <td><strong>{row.name}</strong></td>
                                            <td><span className={`badge ${row.type === 'संस्थापक' ? 'badge-primary' : 'badge-secondary'}`}>{row.type}</span></td>
                                            <td>{row.shares}</td>
                                            <td>{row.date1}</td>
                                            <td>{row.date2}</td>
                                            <td>{row.method}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="note-box mt-4">
                            <p><strong>नोट:</strong> साधारण सभा पछि संचालकहरु नियुक्ति भए सो सम्बन्धि जानकारी र सो सम्बन्धमा बोर्डलाई जानकारी गराएको मिति समेत छुट्टै उल्लेख गर्नुपर्ने । पछिल्लो साधारण सभा पछि संचालकहरु नियुक्त नभएको ।</p>
                            <p className="mt-1">*मिति २०८२/०९/१७ गते राजिनामा स्वीकृत भएको ।</p>
                        </div>
                    </div>
                </div>

                {/* Section 3: Board Meetings */}
                <div className="governance-card" data-aos="fade-up">
                    <div className="card-header">
                        <FileText className="card-icon" />
                        <h3>३. संचालक समितिको बैठक</h3>
                    </div>
                    <div className="card-body">
                        <h4 className="table-title">(घ) संचालक समितिको नियमित बैठक संचालन सम्बन्धी विवरण:</h4>
                        <div className="table-responsive">
                            <table className="gov-table">
                                <thead>
                                    <tr>
                                        <th>क्र. सं.</th>
                                        <th>बैठक मिति</th>
                                        <th>उपस्थित संख्या</th>
                                        <th>भिन्न मत</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Using CSS Grid / Flex for this long list might be better visually, but table is standard for data */}
                                    <tr className="flex-wrap-row">
                                        <td colSpan="4" className="p-0">
                                            <div className="meetings-grid">
                                                {[
                                                    { sn: '१', date: '२०८१/०५/१२', count: '५' },
                                                    { sn: '२', date: '२०८१/०६/०७', count: '४' },
                                                    { sn: '३', date: '२०८१/०८/०९', count: '४' },
                                                    { sn: '४', date: '२०८१/०८/११', count: '५' },
                                                    { sn: '५', date: '२०८१/०९/१२', count: '४' },
                                                    { sn: '६', date: '२०८१/०९/२५', count: '४' },
                                                    { sn: '७', date: '२०८१/०९/२६', count: '४' },
                                                    { sn: '८', date: '२०८१/१०/०८', count: '६' },
                                                    { sn: '९', date: '२०८१/१०/११', count: '५' },
                                                    { sn: '१०', date: '२०८१/१०/१२', count: '४' },
                                                    { sn: '११', date: '२०८१/१०/२९', count: '५' },
                                                    { sn: '१२', date: '२०८१/१२/०७', count: '५' },
                                                    { sn: '१३', date: '२०८१/१२/१३', count: '४' },
                                                    { sn: '१४', date: '२०८१/१२/१५', count: '५' },
                                                    { sn: '१५', date: '२०८१/१२/१८', count: '४' },
                                                    { sn: '१६', date: '२०८१/१२/२५', count: '६' },
                                                    { sn: '१७', date: '२०८१/१२/२९', count: '६' },
                                                    { sn: '१८', date: '२०८२/०१/०७', count: '७' },
                                                    { sn: '१९', date: '२०८२/०१/१०', count: '६' },
                                                    { sn: '२०', date: '२०८२/०१/२६', count: '५' },
                                                    { sn: '२१', date: '२०८२/०२/१०', count: '६' },
                                                    { sn: '२२', date: '२०८२/०२/१०', count: '६' },
                                                    { sn: '२३', date: '२०८२/०२/१५', count: '६' },
                                                    { sn: '२४', date: '२०८२/०३/०४', count: '४' },
                                                    { sn: '२५', date: '२०८२/०३/१२', count: '५' },
                                                ].map((meeting, index) => (
                                                    <div key={index} className="meeting-item">
                                                        <span className="meeting-sn">#{meeting.sn}</span>
                                                        <span className="meeting-date">{meeting.date}</span>
                                                        <span className="meeting-count">उपस्थित: {meeting.count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="info-box mt-4">
                            कुनै संचालक समितिको बैठक आवश्यक गणपूरक संख्या नपुगी स्थगित भएको भए सोको विवरण: <strong>बैठक स्थगित नभएको ।</strong>
                        </div>
                    </div>
                </div>

                {/* Section 4: Management Team */}
                <div className="governance-card" data-aos="fade-up">
                    <div className="card-header">
                        <TrendingUp className="card-icon" />
                        <h3>४. उच्च व्यवस्थापन तथा कर्मचारी विवरण</h3>
                    </div>
                    <div className="card-body">
                        <h4 className="table-title">(ग) उच्च व्यवस्थापन तहका कर्मचारीहरुको विवरण:</h4>
                        <div className="management-grid">
                            {[
                                {
                                    id: '१',
                                    name: 'डा. रोमन मान श्रेष्ठ',
                                    role: 'प्रमुख कार्यकारी अधिकृत',
                                    edu: ['विद्यावारिधि - सिनावात्रा विश्वविद्यालय', 'स्नातकोत्तर (कन्स्ट्रक्सन इन्जिनियरिङ)', 'स्नातक (सिभिल तथा रुरल इन्जिनियरिङ)', 'स्नातकोत्तर (व्यापार प्रशासन)'],
                                    exp: 'निर्माण, शैक्षिक, विभिन्न क्षेत्रमा प्रशिक्षण, मेसिनरी एण्ड टुल्स तथा अनुसन्धान क्षेत्रमा ११ वर्षको कार्यअनुभव।'
                                },
                                {
                                    id: '२',
                                    name: 'भूमिका शाह',
                                    role: 'वरिष्ठ कानुन अधिकृत',
                                    address: 'विराटनगर म.न.पा. वडा नं २० मोरङ',
                                    edu: ['कानुन अधिकृत (बन्दीपुर केबलकार)', 'गान्धि एण्ड एसोसिएट्स', 'प्याराडाइज लिगल च्याम्बर'],
                                    exp: 'बन्दीपुर केबलकार एण्ड टुरिजम लिमिटेड २०८१ चैत्र १० देखि हालसम्म।'
                                },
                                {
                                    id: '३',
                                    name: 'हरि प्रसाद सुवेदी',
                                    role: 'वरिष्ठ लेखा अधिकृत',
                                    address: 'कुश्मा १ पर्वत',
                                    edu: ['लेखापाल अनुभव'],
                                    exp: 'बन्दीपुर केबल कार एण्ड टुरिजम लिमिटेड २०७८ वैशाख देखि हालसम्म।'
                                },
                                {
                                    id: '४',
                                    name: 'तेजेन्द्र ढकाल',
                                    role: 'सहायक बजार अधिकृत',
                                    address: 'कालिगण्डकी गा.पा ०६, गुल्मी',
                                    edu: ['बजार अधिकृत अनुभव'],
                                    exp: 'बन्दीपुर केबल कार एण्ड टुरिजम लिमिटेड २०८१ श्रावण देखि हालसम्म।'
                                }
                            ].map((person, i) => (
                                <div key={i} className="team-card">
                                    <div className="team-header">
                                        <h4>{person.name}</h4>
                                        <span className="team-role">{person.role}</span>
                                    </div>
                                    <div className="team-body">
                                        {person.address && <p className="team-address"><Users size={14} /> {person.address}</p>}
                                        <div className="team-section">
                                            <strong>योग्यता:</strong>
                                            <ul>
                                                {person.edu.map((e, idx) => <li key={idx}>{e}</li>)}
                                            </ul>
                                        </div>
                                        <div className="team-section">
                                            <strong>अनुभव:</strong>
                                            <p>{person.exp}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="other-details mt-8">
                            <h4 className="table-title">अन्य विवरण</h4>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <label>कर्मचारी पदपूर्ति प्रकृया</label>
                                    <span>संचालक समितिबाट स्वीकृत कर्मचारी सेवा विनियमावलिमा व्यवस्था भए बमोजिम</span>
                                </div>
                                <div className="detail-item">
                                    <label>व्यवस्थापन कर्मचारी संख्या</label>
                                    <span>७</span>
                                </div>
                                <div className="detail-item">
                                    <label>कुल कर्मचारी संख्या</label>
                                    <span>७४</span>
                                </div>
                                <div className="detail-item">
                                    <label>सक्सेसन प्लान</label>
                                    <span>भएको</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 5: Audit & Policies */}
                <div className="governance-card" data-aos="fade-up">
                    <div className="card-header">
                        <Scale className="card-icon" />
                        <h3>५. संस्थाको लेखा तथा जोखिम व्यवस्थापन</h3>
                    </div>
                    <div className="card-body">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="subsection-title">लेखापरीक्षण विवरण</h4>
                                <ul className="info-list">
                                    <li><strong>NFRS अनुसार वित्तीय विवरण:</strong> <span>तयार गरेको</span></li>
                                    <li><strong>वित्तीय विवरण स्वीकृत मिति:</strong> <span>२०८१/०९/२८</span></li>
                                    <li><strong>अन्तिम लेखापरीक्षण मिति:</strong> <span>२०८१/०९/२८</span></li>
                                    <li><strong>साधारण सभाबाट स्वीकृत मिति:</strong> <span>२०८२/०१/०६</span></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="subsection-title">बैठक भत्ता विवरण</h4>
                                <ul className="info-list">
                                    <li><strong>बैठक भत्ता निर्धारण मिति:</strong> <span>२०८२ वैशाख ०६</span></li>
                                    <li><strong>अध्यक्ष भत्ता:</strong> <span>रू. ८,०००/-</span></li>
                                    <li><strong>संचालक भत्ता:</strong> <span>रू. ५,०००/-</span></li>
                                    <li><strong>कुल बैठक खर्च:</strong> <span>रू. ७,००,०००/-</span></li>
                                </ul>
                            </div>
                        </div>

                        <div className="risk-management mt-8">
                            <div className="highlight-box warning">
                                <h4 className="flex items-center gap-2 mb-2">
                                    <AlertCircle size={20} />
                                    ३. संस्थाको जोखिम व्यवस्थापन तथा आन्तरिक नियन्त्रण प्रणाली
                                </h4>
                                <p><strong>जोखिम व्यवस्थापन समिति:</strong> गठन भएको (मिति २०८२/०७/२१ को निर्णय)</p>

                                <div className="committee-members mt-3">
                                    <strong>समितिको संरचना:</strong>
                                    <ul className="mt-2 list-disc pl-5">
                                        <li>संचालक, कृष्ण राज अधिकारी (संयोजक)</li>
                                        <li>स्वतन्त्र संचालक, बाबुराम अर्याल (सदस्य)</li>
                                        <li>नायब प्रमुख कार्यकारी अधिकृत, श्री आदित्य बिष्ट (सदस्य)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default Governance;
