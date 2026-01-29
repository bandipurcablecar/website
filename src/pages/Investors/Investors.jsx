import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { supabase } from '../../lib/supabase';
import { FileText, Download, Calendar, ExternalLink } from 'lucide-react';
import './Investors.css';

export default function Investors() {
    const [documents, setDocuments] = useState([]);
    const [capitalStructure, setCapitalStructure] = useState([]);
    const [directorShares, setDirectorShares] = useState([]);
    const [financialTables, setFinancialTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeAuditYear, setActiveAuditYear] = useState('2081-2082');
    const [activeAgmYear, setActiveAgmYear] = useState('2080-2081');
    const [activeQuarterYear, setActiveQuarterYear] = useState('2081-2082');

    useEffect(() => {
        AOS.init({ duration: 800, once: true, offset: 100 });
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [docsRes, capitalRes, directorsRes, tablesRes, recordsRes] = await Promise.all([
                supabase.from('documents').select('*').order('published_at', { ascending: false }),
                supabase.from('ipo_capital_structure').select('*').order('display_order', { ascending: true }),
                supabase.from('director_shares').select('*').order('display_order', { ascending: true }),
                supabase.from('financial_tables').select('*').order('display_order', { ascending: true }),
                supabase.from('financial_records').select('*').order('display_order', { ascending: true })
            ]);

            if (docsRes.error) throw docsRes.error;

            setDocuments(docsRes.data || []);
            setCapitalStructure(capitalRes.data || []);
            setDirectorShares(directorsRes.data || []);

            // Process tables with their records
            const tables = (tablesRes.data || []).map(table => ({
                ...table,
                records: (recordsRes.data || []).filter(r => r.table_id === table.id)
            }));
            setFinancialTables(tables);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    // Group documents by category and fiscal year
    const auditReports = documents.filter(doc => doc.category === 'audit-reports');
    const agmReports = documents.filter(doc => doc.category === 'agm-reports');
    const quarterlyReports = documents.filter(doc => doc.category === 'quarterly-reports');

    // Get unique fiscal years for each category
    const auditYears = [...new Set(auditReports.map(r => r.fiscal_year))].filter(Boolean).sort((a, b) => b.localeCompare(a));
    const agmYears = [...new Set(agmReports.map(r => r.fiscal_year))].filter(Boolean).sort((a, b) => b.localeCompare(a));
    const quarterYears = [...new Set(quarterlyReports.map(r => r.fiscal_year))].filter(Boolean).sort((a, b) => b.localeCompare(a));

    // Set initial active years
    useEffect(() => {
        if (auditYears.length > 0 && !auditYears.includes(activeAuditYear)) {
            setActiveAuditYear(auditYears[0]);
        }
        if (agmYears.length > 0 && !agmYears.includes(activeAgmYear)) {
            setActiveAgmYear(agmYears[0]);
        }
        if (quarterYears.length > 0 && !quarterYears.includes(activeQuarterYear)) {
            setActiveQuarterYear(quarterYears[0]);
        }
    }, [auditYears.length, agmYears.length, quarterYears.length]);

    return (
        <main className="investors-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="page-hero-bg" style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920)`
                }}></div>
                <div className="page-hero-overlay"></div>
                <div className="container">
                    <div className="page-hero-content" data-aos="fade-up">
                        <span className="page-hero-subtitle">Investors Relation</span>
                        <h1 className="page-hero-title">Financial Reports & IPO</h1>
                        <p className="page-hero-description">
                            Transparency and accountability for our shareholders
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="section">
                <div className="container">
                    <div className="quick-links-grid">
                        <a
                            href="https://iporesult.cdsc.com.np/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="quick-link-card"
                            data-aos="fade-up"
                        >
                            <div className="quick-link-icon" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
                                <ExternalLink size={28} />
                            </div>
                            <h3>IPO Result (Public)</h3>
                            <p>Check your IPO allotment status</p>
                        </a>
                        <a
                            href="https://forms.gle/VXAjZpoTQRYjttVKA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="quick-link-card"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            <div className="quick-link-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
                                <FileText size={28} />
                            </div>
                            <h3>Dematerialization of Promoter Share</h3>
                            <p>Fill the share details form</p>
                        </a>
                        <a
                            href="/ipo"
                            className="quick-link-card"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <div className="quick-link-icon" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' }}>
                                <Calendar size={28} />
                            </div>
                            <h3>IPO Details</h3>
                            <p>View complete IPO information</p>
                        </a>
                    </div>
                </div>
            </section>

            {/* Financial Information Section */}
            <section className="section section-gray">
                <div className="container">
                    <div className="financial-header" data-aos="fade-up">
                        <span className="financial-badge">Financial Info</span>
                        <h2 className="financial-title">Financial Information And Reports</h2>
                        <p className="financial-description">
                            Bandipur Cablecar & Tourism Limited maintains the transparency and accountability in data.
                            Company performs internal & external audit Annually.
                        </p>
                    </div>

                    {/* Audit Reports */}
                    <div className="report-section" data-aos="fade-up">
                        <div className="report-section-header">
                            <h3>Audit Report Of Bandipur Cable Car</h3>
                        </div>
                        <div className="fiscal-year-tabs">
                            {auditYears.length > 0 ? auditYears.map(year => (
                                <button
                                    key={year}
                                    className={`fiscal-tab ${activeAuditYear === year ? 'active' : ''}`}
                                    onClick={() => setActiveAuditYear(year)}
                                >
                                    {year}
                                </button>
                            )) : (
                                <p className="no-data">No audit reports available</p>
                            )}
                        </div>
                        <div className="reports-list">
                            {auditReports
                                .filter(report => report.fiscal_year === activeAuditYear)
                                .map(report => (
                                    <a
                                        key={report.id}
                                        href={report.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="report-item"
                                    >
                                        <div className="report-item-icon">
                                            <FileText size={24} />
                                        </div>
                                        <span className="report-item-title">{report.title}</span>
                                    </a>
                                ))}
                            {auditReports.filter(r => r.fiscal_year === activeAuditYear).length === 0 && (
                                <p className="no-reports">No reports for this fiscal year</p>
                            )}
                        </div>
                    </div>

                    {/* AGM Reports */}
                    <div className="report-section" data-aos="fade-up">
                        <div className="report-section-header">
                            <h3>AGM Report Of Bandipur Cable Car</h3>
                        </div>
                        <div className="fiscal-year-tabs">
                            {agmYears.length > 0 ? agmYears.map(year => (
                                <button
                                    key={year}
                                    className={`fiscal-tab ${activeAgmYear === year ? 'active' : ''}`}
                                    onClick={() => setActiveAgmYear(year)}
                                >
                                    {year}
                                </button>
                            )) : (
                                <p className="no-data">No AGM reports available</p>
                            )}
                        </div>
                        <div className="reports-list">
                            {agmReports
                                .filter(report => report.fiscal_year === activeAgmYear)
                                .map(report => (
                                    <a
                                        key={report.id}
                                        href={report.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="report-item"
                                    >
                                        <div className="report-item-icon">
                                            <FileText size={24} />
                                        </div>
                                        <span className="report-item-title">{report.title}</span>
                                    </a>
                                ))}
                            {agmReports.filter(r => r.fiscal_year === activeAgmYear).length === 0 && (
                                <p className="no-reports">No reports for this fiscal year</p>
                            )}
                        </div>
                    </div>

                    {/* Quarterly Reports */}
                    <div className="report-section" data-aos="fade-up">
                        <div className="report-section-header">
                            <h3>Quarterly Reports</h3>
                        </div>
                        <div className="fiscal-year-tabs">
                            {quarterYears.length > 0 ? quarterYears.map(year => (
                                <button
                                    key={year}
                                    className={`fiscal-tab ${activeQuarterYear === year ? 'active' : ''}`}
                                    onClick={() => setActiveQuarterYear(year)}
                                >
                                    {year}
                                </button>
                            )) : (
                                <p className="no-data">No quarterly reports available</p>
                            )}
                        </div>
                        <div className="reports-list">
                            {quarterlyReports
                                .filter(report => report.fiscal_year === activeQuarterYear)
                                .map(report => (
                                    <a
                                        key={report.id}
                                        href={report.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="report-item"
                                    >
                                        <div className="report-item-icon">
                                            <FileText size={24} />
                                        </div>
                                        <span className="report-item-title">{report.title}</span>
                                    </a>
                                ))}
                            {quarterlyReports.filter(r => r.fiscal_year === activeQuarterYear).length === 0 && (
                                <p className="no-reports">No reports for this fiscal year</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Capital Structure Section */}
            <section className="section bg-white">
                <div className="container">
                    <div className="section-header center" data-aos="fade-up">
                        <span className="financial-badge">Structure</span>
                        <h2 className="section-title">Capital Structure</h2>
                        <p className="section-description">
                            Detailed breakdown of the company's capital allocation and share distribution (निष्कासन पछिको चुक्ता पूँजी).
                        </p>
                    </div>

                    <div className="capital-structure-table-wrapper" data-aos="fade-up">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th className="text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="font-semibold text-gray-800">Promoter Shares</td>
                                    <td className="text-right text-gray-600">22,440,000 (79.29%)</td>
                                </tr>
                                <tr>
                                    <td className="font-semibold text-gray-800">Public Shares</td>
                                    <td className="text-right text-gray-600">5,860,000 (20.71%)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Financial Ratios Section */}
            <section className="section bg-gray-50">
                <div className="container">
                    <div className="section-header center" data-aos="fade-up">
                        <span className="financial-badge">Analysis</span>
                        <h2 className="section-title">परियोजनासँग सम्बन्धित वित्तीय अनुपातहरु</h2>
                        <p className="section-description">Project Financial Ratios & Cash Flow Analysis</p>
                    </div>

                    <div className="financial-ratios-wrapper" data-aos="fade-up">
                        {/* Key Metrics Table */}
                        <div className="table-responsive mb-8">
                            <table className="custom-table table-bordered">
                                <tbody>
                                    <tr>
                                        <td>परियोजनाको कुल लागत</td>
                                        <td className="text-right">रु. ३,८५,००,००,०००/-</td>
                                    </tr>
                                    <tr>
                                        <td>प्रक्षेपित लागत दर</td>
                                        <td className="text-right">१०.२१%</td>
                                    </tr>
                                    <tr>
                                        <td>आन्तरिक प्रतिफल दर (IRR)</td>
                                        <td className="text-right">२७.७४%</td>
                                    </tr>
                                    <tr>
                                        <td>परियोजनाको खुद वर्तमान मूल्य (NPV)</td>
                                        <td className="text-right">रु. ९,७२,१४,२०,३६९/-</td>
                                    </tr>
                                    <tr>
                                        <td>स्वपुँजीमा आन्तरिक प्रतिफल दर (Equity IRR)</td>
                                        <td className="text-right">२६.७७%</td>
                                    </tr>
                                    <tr>
                                        <td>स्वपुँजीमा परियोजनाको खुद वर्तमान मूल्य (Equity NPV)</td>
                                        <td className="text-right">रु. ९,१३,६७,७७,५१६/-</td>
                                    </tr>
                                    <tr>
                                        <td>बट्टा दर (Discount Factor)</td>
                                        <td className="text-right">१०.२१%</td>
                                    </tr>
                                    <tr>
                                        <td>साधारण लगानी फिर्ता हुने अवधि</td>
                                        <td className="text-right">८.२२ वर्ष</td>
                                    </tr>
                                    <tr>
                                        <td>लगानी फिर्ता हुने अवधि</td>
                                        <td className="text-right">१०.०५ वर्ष</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Note Paragraph */}
                        <div className="financial-note mb-8 p-6 bg-white rounded-lg shadow-sm border-l-4 border-blue-600">
                            <p className="text-gray-700 leading-relaxed">
                                NPV तथा IRR गणना गर्दा नगद प्रवाह विधि अनुरुप गणना गरिएको छ भने बट्टा दर (Discount Factor) १०.२१% लिएको छ र परियोजनाको खुद वर्तमान मूल्य (NPV) आगामि १० आ.व. को प्रक्षेपित तथ्याङ्क साथै सो पश्चात्‌को अन्तिम मूल्यमा (टर्मिनल भ्यालु) ५% को वार्षिक वृद्धि दर लिइएको छ ।
                                <br />
                                आयोजनाको साधारण लगानि तथा डिस्काउन्टमा लगानी फिर्ता हुने अवधि निम्न अनुसार गणना गरिएको छ ।
                            </p>
                        </div>

                        {/* Cash Flow Table */}
                        <div className="table-responsive">
                            <table className="custom-table table-bordered text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-center">Year</th>
                                        <th className="text-right">Cash Flow<br />(Undiscounted)</th>
                                        <th className="text-right">Cumulative Cash<br />Flow (SIMPLE)</th>
                                        <th className="text-right">Discounted Cash<br />Flow</th>
                                        <th className="text-right">Cumulative Cash<br />Flow (Discounted)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { year: '०', cf: '(२,०४३,२५७,५५४)', ccf: '(२,०४३,२५७,५५४)', dcf: '(२,०४३,२५७,५५४)', cdcf: '(२,०४३,२५७,५५४)' },
                                        { year: '१', cf: '(७०६,१५१,८८१)', ccf: '(२,७४९,४०९,४३५)', dcf: '(६४०,७६१,८७३)', cdcf: '(२,६८४,०१९,४२७)' },
                                        { year: '२', cf: '२४,३७९,७५४', ccf: '(२,७२५,०२९,६८१)', dcf: '२०,०७३,६५२', cdcf: '(२,६६३,९४५,७७५)' },
                                        { year: '३', cf: '(९२६,२०७,२१५)', ccf: '(३,६५१,२३६,८९७)', dcf: '(६९१,९९६,३२२)', cdcf: '(३,३५५,९४२,०९७)' },
                                        { year: '४', cf: '५३२,४०५,४५८', ccf: '(३,११८,८३१,४३९)', dcf: '३६०,९४१,३७४', cdcf: '(२,९९५,०००,७२३)' },
                                        { year: '५', cf: '३९४,९७५,११४', ccf: '(२,७२३,८५६,३२५)', dcf: '२४२,९७५,४७७', cdcf: '(२,७५२,०२५,२४६)' },
                                        { year: '६', cf: '७८८,५५१,३४८', ccf: '(१,९३५,३०४,९७८)', dcf: '४४०,१७०,८०२', cdcf: '(२,३११,८५४,४४५)' },
                                        { year: '७', cf: '८५९,११३,७२२', ccf: '(१,०७६,१९१,२५६)', dcf: '४३५,१५१,४६५', cdcf: '(१,८७६,७०२,९८०)' },
                                        { year: '८', cf: '८३२,११९,३८३', ccf: '(२४४,०७१,८७३)', dcf: '३८२,४४९,३९२', cdcf: '(१,४९४,२५३,५८८)' },
                                        { year: '९', cf: '१,०९६,०५९,३५६', ccf: '८५१,९८७,४८३', dcf: '४५७,११०,२४२', cdcf: '(१,०३७,१४३,३४६)' },
                                        { year: '१०', cf: '१,२९८,८७४,८४१', ccf: '२,१५०,८६२,३२४', dcf: '४९१,५३३,०५१', cdcf: '(५४५,६१०,२९५)' },
                                        { year: '११', cf: '२९,८९९,२९१,४५४', ccf: '३२,०५०,१५३,७७७', dcf: '१०,२६७,०३०,६६५', cdcf: '९,७२१,४२०,३६९' },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="text-center font-medium">{row.year}</td>
                                            <td className="text-right font-mono">{row.cf}</td>
                                            <td className="text-right font-mono">{row.ccf}</td>
                                            <td className="text-right font-mono">{row.dcf}</td>
                                            <td className="text-right font-mono">{row.cdcf}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="text-center mt-6 p-4 bg-blue-50 text-blue-800 rounded">
                            <p>आयोजनाको आन्तरिक प्रतिफल दर (IRR) र परियोजनाको खुद वर्तमान मूल्य (NPV) निम्न अनुसार गणना गरिएको छ ।</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Financial Tables */}
            {financialTables.map((table) => (
                <section key={table.id} className="section bg-white">
                    <div className="container">
                        <div className="section-header center" data-aos="fade-up">
                            <span className="financial-badge">Financial Data</span>
                            <h2 className="section-title">{table.title}</h2>
                            {table.subtitle && (
                                <p className="section-description">{table.subtitle}</p>
                            )}
                        </div>

                        <div className="capital-structure-table-wrapper" data-aos="fade-up">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        {Array.isArray(table.column_headers) && table.column_headers.map((header, index) => (
                                            <th key={index} className={index > 1 ? 'text-right' : ''}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.records.map((record) => (
                                        <tr key={record.id} className={record.is_highlighted ? 'total-row' : ''}>
                                            <td>{record.sn}</td>
                                            <td>{record.description}</td>
                                            {record.col_1 && <td className="text-right">{record.col_1}</td>}
                                            {record.col_2 && <td className="text-right">{record.col_2}</td>}
                                            {record.col_3 && <td className="text-right">{record.col_3}</td>}
                                            {record.col_4 && <td className="text-right">{record.col_4}</td>}
                                        </tr>
                                    ))}
                                    {table.records.length === 0 && (
                                        <tr>
                                            <td colSpan={table.column_headers?.length || 1} className="text-center py-4 text-gray-500">
                                                No data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            ))}

            {/* Directors' Share Ownership Section */}
            <section className="section section-gray">
                <div className="container">
                    <div className="section-header center" data-aos="fade-up">
                        <span className="financial-badge">Governance</span>
                        <h2 className="section-title">Directors' Share Ownership</h2>
                        <p className="section-description">
                            Details of share ownership held by company directors/officers up to Fiscal Year 2081/082.
                        </p>
                    </div>

                    <div className="director-shares-card" data-aos="fade-up">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>NAME</th>
                                    <th>POSITION</th>
                                    <th className="text-right">SHARE QUANTITY (KITTA)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {directorShares.map((director) => (
                                    <tr key={director.id}>
                                        <td className="font-medium">{director.name}</td>
                                        <td>{director.position}</td>
                                        <td className="text-right font-bold text-blue-900">
                                            {director.share_quantity ? director.share_quantity.toLocaleString() : '-'}
                                        </td>
                                    </tr>
                                ))}
                                {directorShares.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4 text-gray-500">
                                            Loading share ownership details...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="table-footer-note">
                            <p>* Data as of Fiscal Year 2081/082</p>
                            <p className="italic mt-1">Note: Mr. Shiva Prasad Sharma and Mr. Taranath Upadhyay are now Former Directors.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
