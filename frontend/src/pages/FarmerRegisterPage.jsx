import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/*  ---------- COMPONENTS ----------  */
import Section from "../components/layout/Section";
import PrivacyNotice from "../components/forms/PrivacyNotice";

/*  ---------- SVG ----------  */
import ArrowCircleIcon from "../svg/ArrowCircleIcon";

const EMPTY_FARMER = {
    fullName: "",
    email: "",
    phone: "",
    farmName: "",
    municipality: "",
};

const FARMER_STEPS = ["Owner & Farm Info", "Verify Email", "Safety Checklist"];

export default function FarmerRegisterPage() {
    const navigate = useNavigate();
    const [farmer, setFarmer] = useState(EMPTY_FARMER);
    const [privacyAgreed, setPrivacyAgreed] = useState(false);
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);

    function updateField(event) {
        const { name, value } = event.target;
        setFarmer((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    function validate() {
        const next = {};
        if (!farmer.fullName.trim()) next.fullName = "Enter the farm owner or manager's full name.";
        if (!/^\S+@\S+\.\S+$/.test(farmer.email)) next.email = "Enter a valid email address.";
        const digits = farmer.phone.replace(/[\s-]/g, "");
        if (!/^(\+63|0)?9\d{9}$/.test(digits)) {
            next.phone = "Enter a valid mobile number, like 0917 123 4567.";
        }
        if (!farmer.farmName.trim()) next.farmName = "Enter your farm's name.";
        if (!farmer.municipality.trim()) next.municipality = "Enter your city or municipality.";
        if (!privacyAgreed) next.privacyAgreed = "Please agree to the Data Privacy Notice to continue.";
        return next;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const found = validate();
        if (Object.keys(found).length) {
            setErrors(found);
            return;
        }

        setBusy(true);
        try {
            // TODO: Wire to FastAPI farmer sign-up endpoint
            await new Promise((resolve) => setTimeout(resolve, 400));
            navigate(
                `/verify-email?role=farmer&email=${encodeURIComponent(farmer.email)}&farm=${encodeURIComponent(farmer.farmName)}`
            );
        } catch (err) {
            setErrors({ form: err.message || "We couldn't create your farmer account. Try again." });
        } finally {
            setBusy(false);
        }
    }

    return (
        <Section id="FarmerRegister" tone="light" watermark="PARTNER">
            <div className="reg reg--wide">
                <header className="reg-header reg-header--ruled">
                    <p className="reg-eyebrow">partner with save ph</p>
                    <h1>Farmer registration</h1>
                    <p className="reg-lede">host college volunteers on your farm</p>
                </header>

                {/* Bento-style partner perk & student switcher strip */}
                <div className="partner-strip">
                    <div className="partner-strip__card partner-strip__card--dark">
                        <span className="bento__label">HOST PERKS</span>
                        <div className="partner-strip__metrics">
                            <div>
                                <strong>01</strong>
                                <span>Extra hands for planting & harvest</span>
                            </div>
                            <div>
                                <strong>02</strong>
                                <span>Safety-vetted student groups</span>
                            </div>
                            <div>
                                <strong>AI</strong>
                                <span>Crop yield & quarter insights</span>
                            </div>
                        </div>
                    </div>

                    <Link to="/contact" className="faq-cta partner-strip__cta">
                        <span className="faq-cta__text">
                            <span>Looking to volunteer instead?</span>
                            <strong>Register as a Student Volunteer</strong>
                        </span>
                        <ArrowCircleIcon className="faq-cta__icon" />
                    </Link>
                </div>

                <div className="reg-card">
                    <ol className="reg-steps" aria-label="Farmer onboarding progress">
                        {FARMER_STEPS.map((label, index) => (
                            <li
                                key={label}
                                className={"reg-steps__item" + (index === 0 ? " is-current" : "")}
                                aria-current={index === 0 ? "step" : undefined}
                            >
                                <span className="reg-steps__num">{index + 1}</span>
                                <span className="reg-steps__label">{label}</span>
                            </li>
                        ))}
                    </ol>

                    <div className="reg-panel">
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="reg-panel__head">
                                <h2 className="reg-step-title">Owner & farm contact</h2>
                                <span className="bento__label">STEP 01 / 03</span>
                            </div>

                            <div className="reg-row">
                                <div className="reg-field">
                                    <label htmlFor="farmer-fullName">Owner / Manager full name</label>
                                    <input
                                        id="farmer-fullName"
                                        name="fullName"
                                        type="text"
                                        autoComplete="name"
                                        placeholder="Juan Dela Cruz"
                                        value={farmer.fullName}
                                        onChange={updateField}
                                        aria-invalid={!!errors.fullName}
                                    />
                                    {errors.fullName && <p className="reg-error" role="alert">{errors.fullName}</p>}
                                </div>

                                <div className="reg-field">
                                    <label htmlFor="farmer-phone">Mobile number</label>
                                    <input
                                        id="farmer-phone"
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        placeholder="0917 123 4567"
                                        value={farmer.phone}
                                        onChange={updateField}
                                        aria-invalid={!!errors.phone}
                                    />
                                    {errors.phone && <p className="reg-error" role="alert">{errors.phone}</p>}
                                </div>
                            </div>

                            <div className="reg-field">
                                <label htmlFor="farmer-email">Email address</label>
                                <input
                                    id="farmer-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="juan@farmname.ph"
                                    value={farmer.email}
                                    onChange={updateField}
                                    aria-invalid={!!errors.email}
                                />
                                <p className="reg-hint">We'll send a 6-digit verification code here before opening the safety checklist.</p>
                                {errors.email && <p className="reg-error" role="alert">{errors.email}</p>}
                            </div>

                            <div className="reg-row">
                                <div className="reg-field">
                                    <label htmlFor="farmer-farmName">Farm name</label>
                                    <input
                                        id="farmer-farmName"
                                        name="farmName"
                                        type="text"
                                        placeholder="San Pablo Highland Organic Farm"
                                        value={farmer.farmName}
                                        onChange={updateField}
                                        aria-invalid={!!errors.farmName}
                                    />
                                    {errors.farmName && <p className="reg-error" role="alert">{errors.farmName}</p>}
                                </div>

                                <div className="reg-field">
                                    <label htmlFor="farmer-municipality">City / Municipality</label>
                                    <input
                                        id="farmer-municipality"
                                        name="municipality"
                                        type="text"
                                        placeholder="San Pablo City"
                                        value={farmer.municipality}
                                        onChange={updateField}
                                        aria-invalid={!!errors.municipality}
                                    />
                                    {errors.municipality && <p className="reg-error" role="alert">{errors.municipality}</p>}
                                </div>
                            </div>

                            <PrivacyNotice
                                id="farmer-privacy"
                                checked={privacyAgreed}
                                onChange={(val) => {
                                    setPrivacyAgreed(val);
                                    setErrors((prev) => ({ ...prev, privacyAgreed: undefined }));
                                }}
                                error={errors.privacyAgreed}
                                purpose="farmer account verification and farm onboarding"
                            />

                            {errors.form && <p className="reg-error" role="alert">{errors.form}</p>}

                            <div className="reg-actions reg-actions--between">
                                <Link to="/register-farm" className="reg-inline-link">
                                    Already verified? Skip to Safety Checklist →
                                </Link>
                                <button type="submit" className="cta-btn reg-cta-submit" disabled={busy}>
                                    <span className="cta-btn__text">
                                        {busy ? "Sending code…" : "Verify Email"}
                                    </span>
                                    <ArrowCircleIcon className="cta-btn__icon" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Section>
    );
}