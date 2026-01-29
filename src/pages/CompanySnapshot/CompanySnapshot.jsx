
import React from 'react';
import './CompanySnapshot.css';

const CompanySnapshot = () => {
    const tableData = [
        { label: "Company Category", value: "Public Limited Company" },
        { label: "Registered Office", value: "Kalimati-13, Kathmandu" },
        { label: "Field Office", value: "Bandipur-4, Tanahun" },
        {
            label: "Company Registration Date",
            value: (
                <div>
                    <div>Registered as Private Limited Company: Push 22, 2069</div>
                    <div>Converted to Public Limited Company: Bhadra 17, 2078.</div>
                </div>
            )
        },
        { label: "Company Registration No", value: "270364/078/079" },
        { label: "Permanent Account No. (PAN)", value: "600918925" },
        {
            label: "Objectives",
            value: (
                <ul className="objectives-list">
                    <li>i) Cable car operation with well-equipped Tourism Infrastructure</li>
                    <li>ii) Well-equipped Hotel operation with quality assurance</li>
                    <li>iii) Well-equipped sightseeing center</li>
                    <li>iv) Convenience restaurant operation</li>
                    <li>v) Investment of promotional share in recreation centre and adventure/Tourism infrastructure companies.</li>
                </ul>
            )
        },
        { label: "Area of operation", value: "Tourism, Hospitality and Adventure" },
        { label: "Cable car ropeway distance", value: "1616 meters" },
        { label: "Hotel Accomodation", value: "80 Keys Rooms" },
        { label: "No. of Shareholders", value: "5670" },
        { label: "No. of employees", value: "74" },
        {
            label: "Other information:",
            value: (
                <div>
                    <div><span className="label-sub">Website:</span> www.bandipurhill.com</div>
                    <div><span className="label-sub">Email address:</span> info@bandipurhill.com</div>
                </div>
            )
        }
    ];

    return (
        <div className="company-snapshot-page">
            <div className="container">
                <div className="snapshot-header">
                    <h1 className="company-title">COMPANY SNAPSHOT</h1>
                    <div className="company-subtitle">As of Ashar 32, 2082</div>
                </div>

                <div className="basic-info-table">
                    <table>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index}>
                                    <td className="info-label">{row.label}</td>
                                    <td className="info-value">{row.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="charts-section">
                    <div className="chart-container capital-structure">
                        <h3 className="chart-title">Capital Structure:</h3>
                        <div className="chart-content">
                            <div className="bar-chart-y-axis">
                                <span>350</span>
                                <span>300</span>
                                <span>250</span>
                                <span>200</span>
                                <span>150</span>
                                <span>100</span>
                                <span>50</span>
                            </div>
                            <div className="bar-chart-bars">
                                {/* Authorized - 3 Arba */}
                                <div className="bar-group">
                                    <div className="bar-value">3 Arba</div>
                                    <div className="bar" style={{ height: '300px', backgroundColor: '#335c94' }}></div>
                                    <div className="bar-label">Authorized</div>
                                </div>
                                {/* Issued - 2 Arba 83 Crore */}
                                <div className="bar-group">
                                    <div className="bar-value">2 Arba 83 Crore</div>
                                    <div className="bar" style={{ height: '283px', backgroundColor: '#335c94' }}></div>
                                    <div className="bar-label">Issued</div>
                                </div>
                                {/* Promoter - 2 Arba 24 Crore 40 Lakhs */}
                                <div className="bar-group">
                                    <div className="bar-value">2 Arba 24 Crore 40 Lakhs</div>
                                    <div className="bar" style={{ height: '224px', backgroundColor: '#335c94' }}></div>
                                    <div className="bar-label">Promoter</div>
                                </div>
                                {/* Public - 58 Crore 60 Lakhs */}
                                <div className="bar-group">
                                    <div className="bar-value">58 Crore 60 Lakhs</div>
                                    <div className="bar" style={{ height: '58px', backgroundColor: '#335c94' }}></div>
                                    <div className="bar-label">Public</div>
                                </div>
                            </div>
                        </div>
                        <div className="chart-y-label">Capital Structure (NPR Crore)</div>
                    </div>

                    <div className="chart-container share-holding">
                        <h3 className="chart-title">Share Holding Pattern</h3>
                        <div className="pie-chart-wrapper">
                            <div className="pie-chart-labels top">
                                <span className="label-box promoter">Promoter 79.29%</span>
                            </div>
                            <div className="pie-chart"></div>
                            <div className="pie-chart-labels bottom">
                                <span className="label-box public">Public 20.71%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanySnapshot;
