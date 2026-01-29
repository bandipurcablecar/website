import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';
import './IPO.css';

export default function IPO() {
    const [capitalStructure, setCapitalStructure] = useState([]);
    const [publicOffering, setPublicOffering] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIPOData();
    }, []);

    async function fetchIPOData() {
        try {
            const [capitalRes, publicRes] = await Promise.all([
                supabase
                    .from('ipo_capital_structure')
                    .select('*')
                    .order('display_order', { ascending: true }),
                supabase
                    .from('ipo_public_offering')
                    .select('*')
                    .order('display_order', { ascending: true })
            ]);

            if (capitalRes.data) setCapitalStructure(capitalRes.data);
            if (publicRes.data) setPublicOffering(publicRes.data);
        } catch (error) {
            console.error('Error fetching IPO data:', error);
        } finally {
            setLoading(false);
        }
    }

    function formatNumber(num) {
        return new Intl.NumberFormat('en-IN').format(num);
    }

    if (loading) {
        return (
            <div className="ipo-container">
                <div className="container">
                    <p className="text-center py-8">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ipo-container">
            <div className="container">
                <div className="ipo-badge">IPO</div>
                <h1 className="ipo-title">निष्कासन पछिको चुक्ता पूँजी</h1>

                {/* IPO Description Text */}
                {/* IPO Description Visuals (Pie Chart & Summary) */}
                <div className="ipo-visuals-container">
                    <h2 className="section-title text-center">साधारण शेयर बाँडफाँड विवरण</h2>
                    <div className="charts-wrapper">
                        <div className="chart-box">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'आयोजना प्रभावित स्थानीय', value: 566000 },
                                            { name: 'वैदेशिक रोजगारीमा रहेका', value: 529400 },
                                            { name: 'कर्मचारी', value: 105880 },
                                            { name: 'सामूहिक लगानी कोष', value: 264700 },
                                            { name: 'सर्वसाधारण', value: 4394020 },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        <Cell fill="#0088FE" />
                                        <Cell fill="#00C49F" />
                                        <Cell fill="#FFBB28" />
                                        <Cell fill="#FF8042" />
                                        <Cell fill="#8884d8" />
                                    </Pie>
                                    <Tooltip formatter={(value) => formatNumber(value)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="summary-box">
                            <table className="summary-table">
                                <thead>
                                    <tr>
                                        <th>बिवरण</th>
                                        <th>शेयर कित्ता</th>
                                        <th>प्रतिशत</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><span className="dot" style={{ background: '#0088FE' }}></span> आयोजना प्रभावित स्थानीय</td>
                                        <td className="text-right">५,६६,०००</td>
                                        <td className="text-right">९.६६%</td>
                                    </tr>
                                    <tr>
                                        <td><span className="dot" style={{ background: '#00C49F' }}></span> वैदेशिक रोजगारीमा रहेका</td>
                                        <td className="text-right">५,२९,४००</td>
                                        <td className="text-right">९.०३%</td>
                                    </tr>
                                    <tr>
                                        <td><span className="dot" style={{ background: '#FFBB28' }}></span> कर्मचारी</td>
                                        <td className="text-right">१,०५,८८०</td>
                                        <td className="text-right">१.८१%</td>
                                    </tr>
                                    <tr>
                                        <td><span className="dot" style={{ background: '#FF8042' }}></span> सामूहिक लगानी कोष</td>
                                        <td className="text-right">२,६४,७००</td>
                                        <td className="text-right">४.५२%</td>
                                    </tr>
                                    <tr>
                                        <td><span className="dot" style={{ background: '#8884d8' }}></span> सर्वसाधारण</td>
                                        <td className="text-right">४३,९४,०२०</td>
                                        <td className="text-right">७४.९८%</td>
                                    </tr>
                                    <tr className="total-row-sm">
                                        <td>जम्मा</td>
                                        <td className="text-right">५८,६०,०००</td>
                                        <td className="text-right">१००%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>





                <h2 className="ipo-subtitle">कम्पनीको प्रति शेयर नेटवर्थ तथा प्रति शेयर आम्दानीको वास्तविक तथा प्रक्षेपित विवरण:</h2>

                {/* Financial Table */}
                <div className="ipo-table-wrapper">
                    <table className="ipo-table financial-table">
                        <thead>
                            <tr>
                                <th rowSpan="2">विवरण</th>
                                <th colSpan="3" style={{ textAlign: 'center' }}>वास्तविक</th>
                                <th rowSpan="2" style={{ textAlign: 'center' }}>चैत्र मसान्त २०८१<br />अपरिष्कृत</th>
                                <th colSpan="3" style={{ textAlign: 'center' }}>प्रक्षेपित</th>
                            </tr>
                            <tr>
                                <th>२०७८/२०७९</th>
                                <th>२०७९/२०८०</th>
                                <th>२०८०/२०८१</th>
                                <th>२०८१/२०८२</th>
                                <th>२०८२/२०८३</th>
                                <th>२०८३/२०८४</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>प्रति शेयर नेटवर्थ (रु.)</td>
                                <td className="number-cell">७१.९७</td>
                                <td className="number-cell">९२.१६</td>
                                <td className="number-cell">९५.२४</td>
                                <td className="number-cell">९२.४१</td>
                                <td className="number-cell">९३.०२</td>
                                <td className="number-cell">१०१.७०</td>
                                <td className="number-cell">११७.९७</td>
                            </tr>
                            <tr>
                                <td>प्रति शेयर आम्दानी (रु.)</td>
                                <td className="number-cell">(१४.४२)</td>
                                <td className="number-cell">(३.३६)</td>
                                <td className="number-cell">(०.३८)</td>
                                <td className="number-cell">(२.८४)</td>
                                <td className="number-cell">(२.२३)</td>
                                <td className="number-cell">७.२४</td>
                                <td className="number-cell">१६.२७</td>
                            </tr>
                            <tr>
                                <td>सञ्चित नाफा /(नोक्सानी) (रु.हजारमा)</td>
                                <td className="number-cell">(५६,०५८)</td>
                                <td className="number-cell">(९८,१२२)</td>
                                <td className="number-cell">(१,०६,७३६)</td>
                                <td className="number-cell">(१,७०,३६३)</td>
                                <td className="number-cell">(१,५६,६८९)</td>
                                <td className="number-cell">४८,०८६</td>
                                <td className="number-cell">५,०८,४६८</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="ipo-additional-info">
                    <h3 className="info-heading">कुल लागतसम्बन्धी विवरण:</h3>
                    <p className="info-text">
                        <strong>यस आयोजनाको कुल अनुमानित लागत (Interest During Construction (IDC)) सहित</strong> रु. ३,८५,००,००,०००/- (अक्षरेपी तीन अर्ब पचासी करोड रुपैया मात्र) रहेको छ ।
                    </p>

                    <h3 className="info-heading">शेयर पूँजीमा लगानी फिर्ता हुने अबधि (Pay Back Period) सम्बन्धी विवरण</h3>
                    <p className="info-text">
                        <strong>साधारण लगानी फिर्ता हुने अबधि (Normal Pay Back Period)</strong> ८.२२ वर्ष र <strong>डिस्काउन्टमा लगानी फिर्ता हुने अबधि (Discounted Pay Back Period)</strong> १०.०५ वर्ष रहेको छ ।
                    </p>
                    <p className="info-highlight">
                        दरखास्तसाथ प्रति साधारण शेयर रु. १००/- का दरले शतप्रतिशत भुक्तानी माग गरिएको ।
                    </p>
                </div>

                <h2 className="ipo-subtitle" style={{ textAlign: 'center', marginTop: '3rem' }}>धितोपत्र निष्काशन खुला हुने मिति:</h2>

                {/* Opening Dates Table */}
                <div className="ipo-table-wrapper">
                    <table className="ipo-table date-table">
                        <thead>
                            <tr>
                                <th colSpan="2" style={{ textAlign: 'center', background: '#e0e0e0', color: '#333' }}>पहिलो चरण: आयोजना प्रभावित क्षेत्रका बासिन्दाहरु तथा श्रम स्वीकृति लिई बैदेशिक रोजगारीमा रहेका नेपालीको लागि</th>
                                <th style={{ textAlign: 'center', background: '#e0e0e0', color: '#333' }}>दोस्रो चरण: सर्वसाधारणहरुको लागि</th>
                            </tr>
                            <tr>
                                <th>आयोजना प्रभावित क्षेत्रका बासिन्दाहरु</th>
                                <th>बैदेशिक रोजगारीमा रहेका नेपालीको लागि</th>
                                <th rowSpan="2" style={{ verticalAlign: 'middle' }}>
                                    आयोजना प्रभावित क्षेत्रका बासिन्दाहरु तथा बैदेशिक रोजगारीमा रहेका नेपालीहरुको लागि शेयर बाँडफाँड पश्चात् सूचना प्रकाशित गरी दोस्रो चरणमा सर्वसाधारणका लागि सार्वजनिक निष्काशन बारे सूचना प्रकाशित गरी जानकारी गराइनेछ ।
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <ul className="date-list">
                                        <li>निष्काशन खुला हुने मिति: २०८२/०४/०६</li>
                                        <li>निष्काशन बन्द हुने मिति (छिटोमा): २०८२/०४/२०</li>
                                        <li>निष्काशन बन्द हुने मिति (ढिलोमा): २०८२/०५/०४</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul className="date-list">
                                        <li>निष्काशन खुला हुने मिति: २०८२/०४/०६</li>
                                        <li>निष्काशन बन्द हुने मिति (छिटोमा): २०८२/०४/०९</li>
                                        <li>निष्काशन बन्द हुने मिति (ढिलोमा): २०८२/०४/२०</li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Issue Manager Section */}
                <div className="issue-manager-section">
                    <div className="manager-header">
                        धितोपत्र निष्काशन तथा बिक्री प्रबन्धक:
                    </div>
                    <div className="manager-content">
                        <div className="manager-logo-area">
                            {/* Placeholder for Logo if not available, using text representation */}
                            <div className="manager-logo-placeholder">
                                <div className="nsmbl-icon">NSMBL</div>
                            </div>
                            <div className="manager-name">
                                <h2>नेपाल एसबिआई मर्चेण्ट बैकिङ्ग लिमिटेड</h2>
                                <h3>Nepal SBI Merchant Banking Ltd.</h3>
                            </div>
                        </div>
                        <div className="manager-details">
                            <p>लेखनाथमार्ग, ठमेल, काठमाडौँ,</p>
                            <p>फोन नं. ०१-४५१२७४३, ४५४१७८०</p>
                            <p>वेबसाइट: <a href="https://www.nsmbl.com.np" target="_blank" rel="noopener noreferrer">www.nsmbl.com.np</a></p>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="ipo-footer-info">
                    <p>
                        नेपाल धितोपत्र बोर्डबाट स्वीकृत विवरणपत्र निष्काशन तथा बिक्री प्रबन्धकको Website: <a href="https://www.nsmbl.com.np" target="_blank" rel="noopener noreferrer">www.nsmbl.com.np</a> निष्काशनकर्ता कम्पनीको Website: <a href="http://www.bandipurcablecar.com.np" target="_blank" rel="noopener noreferrer">www.bandipurcablecar.com.np</a> साथै, नेपाल धितोपत्र बोर्डको Website: <a href="https://www.sebon.gov.np" target="_blank" rel="noopener noreferrer">www.sebon.gov.np</a> बाट समेत हेर्न सकिनेछ ।
                    </p>
                </div>

            </div>
        </div>
    );
}
