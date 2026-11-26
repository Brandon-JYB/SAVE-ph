import { Link } from "react-router-dom";

/*  ---------- COMPONENTS/LAYOUT ----------  */
import Section from "../components/layout/Section";

/*  ---------- SVG ----------  */
import ArrowCircleIcon from "../svg/ArrowCircleIcon";

const PRIVACY_CARDS = [
    {
        tag: "SECTION 01",
        title: "Information We Collect",
        items: [
            "Student Volunteers: Full name, email, mobile number, preferred volunteer date, chosen farm, and optional feedback or questions.",
            "Partner Farmers: Owner/supervisor name, email, mobile number, farm barangay/municipality, crop focus, emergency clinic info, and safety checklist answers.",
        ],
    },
    {
        tag: "SECTION 02",
        title: "How We Use Your Data",
        items: [
            "Verify email ownership via one-time 6-digit passcodes.",
            "Match student volunteers with safety-vetted local farms and send visit reminders.",
            "Maintain emergency readiness and student safety standards on partner farms.",
            "Answer pre-volunteer inquiries and improve Save PH programs.",
        ],
    },
    {
        tag: "SECTION 03",
        title: "Sharing & Protection",
        items: [
            "Save PH never sells, rents, or trades personal data to advertisers or outside brokers.",
            "Visit details (name, date, and emergency contacts) are shared strictly between matched volunteers and their assigned partner farm coordinator.",
        ],
    },
    {
        tag: "SECTION 04",
        title: "Your RA 10173 Rights",
        items: [
            "Access, update, or request permanent deletion of your volunteer or farm records at any time.",
            "Withdraw communication preferences (email or SMS reminders) whenever you choose.",
        ],
    },
];

export default function PrivacyPage() {
    return (
        <Section id="Privacy" tone="light" watermark="PRIVACY">
            <div className="reg reg--wide">
                <header className="reg-header reg-header--ruled">
                    <p className="reg-eyebrow">transparency & data protection</p>
                    <h1>Data privacy notice</h1>
                    <p className="reg-lede">protected under republic act no. 10173</p>
                </header>

                <div className="privacy-bento">
                    {PRIVACY_CARDS.map((card) => (
                        <article className="bento__card privacy-bento__card" key={card.tag}>
                            <span className="bento__label">{card.tag}</span>
                            <h2 className="reg-step-title">{card.title}</h2>
                            <ul className="privacy-bento__list">
                                {card.items.map((text) => (
                                    <li key={text}>{text}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>

                <div className="reg-banner-card reg-banner-card--bottom">
                    <div>
                        <span className="bento__label">DATA REQUESTS</span>
                        <p>
                            Need to update or delete your records? Send a request via our inquiry form using your registered email.
                        </p>
                    </div>
                    <Link to="/contact?mode=inquiry" className="cta-btn reg-cta-submit">
                        <span className="cta-btn__text">Request</span>
                        <ArrowCircleIcon className="cta-btn__icon" />
                    </Link>
                </div>
            </div>
        </Section>
    );
}