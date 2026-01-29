import React, { useEffect } from 'react';
import { useSettings } from '../../hooks/useData';
import './CEOMessage.css';

const CEOMessage = () => {
    const { settings, loading } = useSettings();

    // Debugging
    useEffect(() => {
        // Initialize AOS with a shorter duration and ensure it doesn't hide content on load
        // Or simply remove it if not needed yet
        /* AOS.init({ duration: 800, once: true, offset: 100 }); */
    }, []);

    if (loading) {
        return (
            <div className="ceo-message-page">
                <div className="container">
                    <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
                </div>
            </div>
        );
    }

    // Default content validation - Robust check
    const hasDynamicContent = settings &&
        settings.ceo_message &&
        typeof settings.ceo_message === 'string' &&
        settings.ceo_message.trim().length > 0;

    return (
        <div className="ceo-message-page">
            <div className="container">
                <div className="ceo-header">
                    <span className="sub-title">Message</span>
                    <h1 className="main-title">प्रमुख कार्यकारी अधिकृतको प्रतिबद्धता</h1>
                    <div className="title-underline"></div>
                </div>

                {hasDynamicContent ? (
                    <div
                        className="ceo-content"
                        dangerouslySetInnerHTML={{ __html: settings.ceo_message }}
                    />
                ) : (
                    <div className="ceo-content">
                        {/* Default Static Content */}
                        <div className="content-block">
                            <p>
                                बन्दीपुर प्राकृतिक सौन्दर्य, सांस्कृतिक सम्पदा र मनमोहक वातावरणको अद्वितीय संयोजनले भरिएको स्थान हो, जहाँ वास्तविक खुशी अनुभूत गर्न सकिन्छ । 'बन्दीपुरहिलमा खुशीको अनुभव' भन्ने मूल उद्देश्यसहित, कम्पनीले उच्च-गुणस्तरीय सेवा प्रदानमार्फत प्रत्येक आगन्तुकलाई यस अनुभूति सम्मिलित गराउने दृढ प्रतिबद्धता जनाएको छ ।
                            </p>
                            <p>
                                बन्दीपुरहिल अन्तर्गत बन्दीपुर केबलकार एण्ड टुरिजम लिमिटेड ५६७० प्रवर्द्धक शेयरधनीहरूको सहभागितामा निर्माण भएको समुदाय-आधारित विकास परियोजना हो । कम्पनी दिगो पर्यटन विकासप्रति पूर्ण रूपमा प्रतिबद्ध छ । बन्दीपुर स्वयं इको-टुरिजमको केन्द्रबिन्दु भएकाले दिगो पर्यटनलाई मुख्य यात्राका रूपमा अघि बढाउने हाम्रो दीर्घकालीन रणनीति हो । सुशासन, पारदर्शिता, उत्तरदायित्व र दीर्घकालीन स्थायित्व हाम्रो सञ्चालनको आधारस्तम्भ हो ।
                            </p>
                        </div>

                        {/* Images Row: Image 1 and Image 2 */}
                        <div className="images-row">
                            <div className="grid-image">
                                <img src="/assets/img/news/ceo-msg-1.png" alt="Agreement 1" onError={(e) => e.target.src = 'https://placehold.co/600x400?text=Photo+1'} />
                            </div>
                            <div className="grid-image">
                                <img src="/assets/img/news/ceo-msg-2.png" alt="Agreement 2" onError={(e) => e.target.src = 'https://placehold.co/600x400?text=Photo+2'} />
                            </div>
                        </div>

                        <div className="content-block">
                            <p>
                                बन्दीपुरहिल आफैमा आतिथ्य, साहसिक पर्यटन, स्थानीय संस्कृति, आधुनिक सेवासुविधा र समुदाय-आधारित पर्यटन मोडेलको उत्कृष्ट एकीकृत संरचना हो । कम्पनी अन्तर्गत निर्माण हुँदै गरेका होटल, निर्माण सम्पन्न भएको र सेवा दिइरहेको केबलकार सेवा, ड्राइभ-इन रेस्टुरेन्ट, स्थानीय परिकारमा आधारित 'घुमाउने घर', 'बन्दीपुर हटरी' मार्फत स्न्याक्स सेवा, 'उपहार घर', 'किड्स जोन' तथा स्थानीय उत्पादन प्रदर्शनस्थल 'ग्रिन मार्केट' जस्ता बहुपक्षीय पर्यटन उत्पादनहरू समावेश छ, जसले बन्दीपुरहिललाई एक बहुआयामिक पर्यटन केन्द्र बनाएको छ ।
                            </p>
                            <p>
                                बन्दीपुर आफै इको-टुरिजमको पहिचान बोकेको क्षेत्र भएकाले, दिगो पर्यटन अभ्यासलाई संस्थागत रूपमा अघि बढाउनु हाम्रो प्रमुख रणनीतिक लक्ष्य हो । स्थानीय व्यवसाय, स्थानीय समुदाय तथा स्थानीय उत्पादन-सेवाको समावेशीकरणमार्फत सामुदायिक उत्थान, आर्थिक सशक्तिकरण र पर्यावरणीय संरक्षण को सन्तुलित मोडेल तयार गर्दै हामी दिगो पर्यटनको उदाहरणीय अभ्यास स्थापनातर्फ अग्रसर भएका छौं ।
                            </p>
                        </div>

                        {/* Image 3 Layout */}
                        <div className="content-grid two-col">
                            <div className="grid-image">
                                <img src="/assets/img/news/ceo-msg-3.png" alt="Agreement 3" onError={(e) => e.target.src = 'https://placehold.co/600x400?text=Photo+3'} />
                            </div>
                            <div className="grid-text">
                                <p>
                                    यस उद्देश्यअनुसार कम्पनीले होमस्टे, होटल, सरकारी तथा गैरसरकारी संस्था, स्थानीय निकाय, बैंक, विद्यालय तथा स्थानीय व्यवसायसँग सहकार्य गर्दै आएको छ । पहिलो चरणमा घोडचढी सेवा, सांस्कृतिक पोशाक घर, बन्दीपुरका होमस्टे तथा होटल, ट्याक्सी समिति, एडभेन्चर सेन्टर, सिद्ध गुफा समिति, ईभी चार्जिङ केन्द्र, स्थानीय अचार घर तथा सुवेनिर पसलहरूसँग आशयपत्र (MOU) मार्फत सहकार्य सुदृढ गरिएको छ । भविष्यमा थप धेरै स्थानीय व्यवसाय तथा संस्थालाई समेट्दै सहकार्य विस्तार गरिँदै जानेछ ।
                                </p>
                                <p>
                                    साहसिक गतिविधि थप्न कम्पनीद्वारा सञ्चालित स्काई-साइकिक्लिङ, जिपलाइन प्रमुख आकर्षण हुन् । साथै याफ्टिङ, प्याराग्लाइडिङ, नाइट-टेन्ट, रक-क्लाइम्बिङ, माउन्टेन-बाइकिङ, घोडचढी, गुफा अन्वेषण, क्यानोइङ, सांस्कृतिक पोशाक
                                    अनुभव लगायत विविध गतिविधिहरूसँग सहकार्य गरिएर समग्र साहसिक उत्पादनलाई विस्तृत बनाइएको छ ।
                                </p>
                            </div>
                        </div>

                        <div className="content-block">
                            <p>
                                समयक्रमसँगै कम्पनीले ब्राण्ड निर्माण, ब्राण्ड निर्देशिका, सेवा गुणस्तर मापदण्ड (SOP), व्यवस्थापन संरचना र सञ्चालन प्रणालीलाई मजबुत बनाउँदै आएको छ । व्यवसायको प्राथमिक लक्ष्य नाफामूखी मात्र नभई दीर्घकालीन मूल्य सिर्जना र सामाजिक-आर्थिक योगदान भएकाले, हामीले व्यापारिक विस्तार, बजार अभिमुखीकरण र ग्राहक-अनुभवलाई प्राथमिकतामा राखेका छौं ।
                            </p>
                        </div>

                        {/* Image 4 Layout (Group Photo) */}
                        <div className="content-grid two-col">
                            <div className="grid-image">
                                <img src="/assets/img/news/ceo-msg-4.png" alt="Team Group" onError={(e) => e.target.src = 'https://placehold.co/600x400?text=Group+Photo'} />
                            </div>
                            <div className="grid-text">
                                <p>
                                    संसारभर पहिचान गराउन कम्पनी प्रतिबद्ध छ । कम्पनीले आफ्नै व्यवस्थापन रणनीतिद्वारा विभिन्न व्यवसाय बिना कुनै बाह्य परामर्शदाता प्रभावकारी रूपमा संचालन गर्दै आएको छ, यद्यपि होटल व्यवसाय ब्राण्ड व्यवस्थापन अन्तर्गत सञ्चालन गरिनेछ ।
                                </p>
                                <p>
                                    हामी अहिले बन्दीपुर र आसपासका क्षेत्रमा आधारित पर्यटन अनुभवलाई उत्पादक र व्यावसायिक रुपमा बजारमा प्रस्तुत गर्ने रणनीतिक चरणमा प्रवेश गरेका छौं । शेयरधनी तथा सरोकारवालाहरूको सामूहिक सपना-दृष्टि पूरा गर्न व्यवस्थापन पूर्ण समर्पित छ ।
                                </p>
                            </div>
                        </div>

                        <div className="closing-block">
                            <p>
                                भविष्यमा हामी आफ्नो पेशागत अनुभव, ज्ञान, रणनीतिक योजना, व्यवस्थापन दक्षता तथा नवप्रवर्तनीय सोचमार्फत बन्दीपुरहिललाई राष्ट्रिय मात्र होइन, अन्तर्राष्ट्रिय स्तरको उदाहरणीय पर्यटन मोडेलका रुपमा स्थापित गर्न निरन्तर प्रतिबद्ध रहने छौ ।
                            </p>
                            <div className="signature-block">
                                <div className="signature-name">डा. रोमन मान श्रेष्ठ</div>
                                <div className="signature-title">प्रमुख कार्यकारी अधिकृत</div>
                            </div>
                        </div>
                        {/* End Default Content */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CEOMessage;
