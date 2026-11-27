import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

/*  ---------- COMPONENTS ----------  */
import Section from "../components/layout/Section";
import PrivacyNotice from "../components/forms/PrivacyNotice";

/*  ---------- SVG ----------  */
import ArrowCircleIcon from "../svg/ArrowCircleIcon";

const FARMER_STEPS = ["Owner & Farm Info", "Verify Email", "Safety Checklist"];

const SAFETY_STANDARDS = [
    {
        name: "hasPotableWater",
        tag: "HYDRATION",
        title: "Clean drinking water & handwashing",
        desc: "Free potable water and washing stations are accessible on-site throughout the shift.",
    },
    {
        name: "hasShadedRest",
        tag: "HEAT SAFETY",
        title: "Shaded rest & recovery area",
        desc: "Covered resting space is provided for regular hydration and shade breaks.",
    },
    {
        name: "hasFirstAidKit",
        tag: "FIRST AID",
        title: "Stocked on-site first-aid kit",
        desc: "A complete, accessible first-aid kit is kept on the farm grounds at all times.",
    },
    {
        name: "commitsSafetyBriefing",
        tag: "ORIENTATION",
        title: "10-minute tool & terrain briefing",
        desc: "Supervisors walk students through safe tool handling and terrain boundaries before starting.",
    },
    {
        name: "noHazardousTasks",
        tag: "PROTECTION",
        title: "Zero heavy machinery or chemical spraying",
        desc: "Student volunteers will never operate motorized equipment or handle pesticides/sprayers.",
    },
];

const INITIAL_FARM = {
    farmName: "",
    barangay: "",
    municipality: "",
    focus: "",
    maxStudents: "5",
    safetyLeadName: "",
    safetyLeadPhone: "",
    nearestClinic: "",
    clinicMinutes: "",
    hasPotableWater: false,
    hasShadedRest: false,
    hasFirstAidKit: false,
    commitsSafetyBriefing: false,
    noHazardousTasks: false,
    terrainNotes: "",
    barangayOrDaRef: "",
};

export default function FarmRegistrationPage() {
    const [searchParams] = useSearchParams();
    const isVerified = searchParams.get("verified") === "1";

    const [farm, setFarm] = useState({
        ...INITIAL_FARM,
        farmName: searchParams.get("farm") || "",
    });
    const [privacyAgreed, setPrivacyAgreed] = useState(false);
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const confirmedCount = SAFETY_STANDARDS.filter((s) => farm[s.name]).length;

    function updateField(event) {
        const { name, value, type, checked } = event.target;
        setFarm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        setErrors((prev) => ({ ...prev, [name]: undefined, safety: undefined }));
    }

    function validate() {
        const next = {};
        if (!farm.farmName.trim()) next.farmName = "Enter your farm's official name.";
        if (!farm.barangay.trim()) next.barangay = "Enter your barangay.";
        if (!farm.municipality.trim()) next.municipality = "Enter your city or municipality.";
        if (!farm.focus.trim()) next.focus = "List your main crops or volunteer activities.";
        if (!farm.safetyLeadName.trim()) next.safetyLeadName = "Enter the on-site safety supervisor's name.";

        const digits = farm.safetyLeadPhone.replace(/[\s-]/g, "");
        if (!/^(\+63|0)?9\d{9}$/.test(digits)) {
            next.safetyLeadPhone = "Enter a valid mobile number for emergencies.";
        }

        if (!farm.nearestClinic.trim()) next.nearestClinic = "Enter the nearest health center or hospital.";
        if (!farm.clinicMinutes || Number(farm.clinicMinutes) < 1) {
            next.clinicMinutes = "Enter estimated travel time in minutes.";
        }

        if (confirmedCount < SAFETY_STANDARDS.length) {
            next.safety = `Confirm all ${SAFETY_STANDARDS.length} student safety standards (${confirmedCount}/${SAFETY_STANDARDS.length} checked).`;
        }

        if (!privacyAgreed) {
            next.privacyAgreed = "Please agree to the Data Privacy Notice to submit your farm.";
        }
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
            // TODO: Wire to FastAPI farm registration endpoint
            await new Promise((resolve) => setTimeout(resolve, 500));
            setSubmitted(true);
        } catch (err) {
            setErrors({ form: err.message || "We couldn't submit your farm registration. Try again." });
        } finally {
            setBusy(false);
        }
    }

    return (
        <Section id="FarmSafetyRegister" tone="light" watermark="SAFETY">
            <div className="reg reg--wide">
                <header className="reg-header reg-header--ruled">
                    <p className="reg-eyebrow">student safety & farm onboarding</p>
                    <h1>Register your farm</h1>
                    <p className="reg-lede">every partner farm is vetted for student safety</p>
                </header>

                {!isVerified && (
                    <div className="reg-banner-card">
                        <div>
                            <span className="bento__label">VERIFICATION REQUIRED</span>
                            <p>
                                Haven't verified your farmer email yet? Complete Step 1 first so we can link your farm profile.
                            </p>
                        </div>
                        <Link to="/farmer-signup" className="reg-btn">
                            Verify Farmer Email
                        </Link>
                    </div>
                )}

                <div className="reg-card">
                    <ol className="reg-steps" aria-label="Farmer onboarding progress">
                        {FARMER_STEPS.map((label, index) => (
                            <li
                                key={label}
                                className={
                                    "reg-steps__item" +
                                    (index === 2 ? " is-current" : "") +
                                    (index < 2 ? " is-done" : "")
                                }
                                aria-current={index === 2 ? "step" : undefined}
                            >
                                <span className="reg-steps__num">{index + 1}</span>
                                <span className="reg-steps__label">{label}</span>
                            </li>
                        ))}
                    </ol>

                    <div className="reg-panel">
                        {submitted ? (
                            <div className="reg-center reg-success-box">
                                <span className="reg-code">STATUS: SAFETY REVIEW PENDING</span>
                                <h2 className="reg-step-title">Farm profile submitted!</h2>
                                <p>
                                    Thank you! Save PH coordinators will review{" "}
                                    <strong>{farm.farmName}</strong>'s emergency contacts and{" "}
                                    {SAFETY_STANDARDS.length}/{SAFETY_STANDARDS.length} safety
                                    standards before opening student volunteer slots.
                                </p>
                                <div className="reg-actions reg-actions--center">
                                    <Link to="/" className="cta-btn reg-cta-submit">
                                        <span className="cta-btn__text">Back to Home</span>
                                        <ArrowCircleIcon className="cta-btn__icon" />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate>
                                {/* Section 1 */}
                                <div className="reg-panel__head">
                                    <h2 className="reg-step-title">1. Farm profile & capacity</h2>
                                    <span className="bento__label">LOCATION</span>
                                </div>

                                <div className="reg-row">
                                    <div className="reg-field">
                                        <label htmlFor="farm-name">Farm name</label>
                                        <input
                                            id="farm-name"
                                            name="farmName"
                                            type="text"
                                            value={farm.farmName}
                                            onChange={updateField}
                                            aria-invalid={!!errors.farmName}
                                        />
                                        {errors.farmName && <p className="reg-error" role="alert">{errors.farmName}</p>}
                                    </div>

                                    <div className="reg-field">
                                        <label htmlFor="farm-focus">Main crops / volunteer focus</label>
                                        <input
                                            id="farm-focus"
                                            name="focus"
                                            type="text"
                                            placeholder="e.g., Rice transplanting, organic vegetables"
                                            value={farm.focus}
                                            onChange={updateField}
                                            aria-invalid={!!errors.focus}
                                        />
                                        {errors.focus && <p className="reg-error" role="alert">{errors.focus}</p>}
                                    </div>
                                </div>

                                <div className="reg-row">
                                    <div className="reg-field">
                                        <label htmlFor="farm-barangay">Barangay</label>
                                        <input
                                            id="farm-barangay"
                                            name="barangay"
                                            type="text"
                                            value={farm.barangay}
                                            onChange={updateField}
                                            aria-invalid={!!errors.barangay}
                                        />
                                        {errors.barangay && <p className="reg-error" role="alert">{errors.barangay}</p>}
                                    </div>

                                    <div className="reg-field">
                                        <label htmlFor="farm-municipality">City / Municipality</label>
                                        <input
                                            id="farm-municipality"
                                            name="municipality"
                                            type="text"
                                            value={farm.municipality}
                                            onChange={updateField}
                                            aria-invalid={!!errors.municipality}
                                        />
                                        {errors.municipality && <p className="reg-error" role="alert">{errors.municipality}</p>}
                                    </div>

                                    <div className="reg-field reg-field--small">
                                        <label htmlFor="farm-maxStudents">Max students / day</label>
                                        <input
                                            id="farm-maxStudents"
                                            name="maxStudents"
                                            type="number"
                                            min={1}
                                            max={30}
                                            value={farm.maxStudents}
                                            onChange={updateField}
                                        />
                                    </div>
                                </div>

                                {/* Section 2 */}
                                <div className="reg-panel__head reg-panel__head--spaced">
                                    <h2 className="reg-step-title">2. Emergency & medical readiness</h2>
                                    <span className="bento__label">RESPONSE</span>
                                </div>

                                <div className="reg-row">
                                    <div className="reg-field">
                                        <label htmlFor="farm-safetyLeadName">On-site safety supervisor</label>
                                        <input
                                            id="farm-safetyLeadName"
                                            name="safetyLeadName"
                                            type="text"
                                            value={farm.safetyLeadName}
                                            onChange={updateField}
                                            aria-invalid={!!errors.safetyLeadName}
                                        />
                                        {errors.safetyLeadName && <p className="reg-error" role="alert">{errors.safetyLeadName}</p>}
                                    </div>

                                    <div className="reg-field">
                                        <label htmlFor="farm-safetyLeadPhone">Emergency mobile number</label>
                                        <input
                                            id="farm-safetyLeadPhone"
                                            name="safetyLeadPhone"
                                            type="tel"
                                            value={farm.safetyLeadPhone}
                                            onChange={updateField}
                                            aria-invalid={!!errors.safetyLeadPhone}
                                        />
                                        {errors.safetyLeadPhone && <p className="reg-error" role="alert">{errors.safetyLeadPhone}</p>}
                                    </div>
                                </div>

                                <div className="reg-row">
                                    <div className="reg-field">
                                        <label htmlFor="farm-nearestClinic">Nearest barangay health center / hospital</label>
                                        <input
                                            id="farm-nearestClinic"
                                            name="nearestClinic"
                                            type="text"
                                            value={farm.nearestClinic}
                                            onChange={updateField}
                                            aria-invalid={!!errors.nearestClinic}
                                        />
                                        {errors.nearestClinic && <p className="reg-error" role="alert">{errors.nearestClinic}</p>}
                                    </div>

                                    <div className="reg-field reg-field--small">
                                        <label htmlFor="farm-clinicMinutes">Travel time (mins)</label>
                                        <input
                                            id="farm-clinicMinutes"
                                            name="clinicMinutes"
                                            type="number"
                                            min={1}
                                            placeholder="10"
                                            value={farm.clinicMinutes}
                                            onChange={updateField}
                                            aria-invalid={!!errors.clinicMinutes}
                                        />
                                        {errors.clinicMinutes && <p className="reg-error" role="alert">{errors.clinicMinutes}</p>}
                                    </div>
                                </div>

                                {/* Section 3: Interactive Safety Cards */}
                                <div className="reg-panel__head reg-panel__head--spaced">
                                    <h2 className="reg-step-title">3. Student safety standards</h2>
                                    <span className="safety-meter">
                                        {confirmedCount} / {SAFETY_STANDARDS.length} CONFIRMED
                                    </span>
                                </div>

                                <div className="safety-cards">
                                    {SAFETY_STANDARDS.map((item, idx) => {
                                        const checked = farm[item.name];
                                        return (
                                            <label
                                                key={item.name}
                                                className={"safety-card" + (checked ? " is-checked" : "")}
                                            >
                                                <input
                                                    type="checkbox"
                                                    name={item.name}
                                                    checked={checked}
                                                    onChange={updateField}
                                                />
                                                <span className="safety-card__badge" aria-hidden="true">
                                                    {checked ? "✓" : `0${idx + 1}`}
                                                </span>
                                                <span className="safety-card__body">
                                                    <span className="safety-card__top">
                                                        <strong>{item.title}</strong>
                                                        <span className="why__tag">{item.tag}</span>
                                                    </span>
                                                    <span className="safety-card__desc">{item.desc}</span>
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                                {errors.safety && <p className="reg-error" role="alert">{errors.safety}</p>}

                                <div className="reg-row reg-row--spaced">
                                    <div className="reg-field">
                                        <label htmlFor="farm-terrainNotes">Terrain / hazard notes for students (optional)</label>
                                        <input
                                            id="farm-terrainNotes"
                                            name="terrainNotes"
                                            type="text"
                                            placeholder="e.g., Muddy paddies, bring boots; uneven hillside paths"
                                            value={farm.terrainNotes}
                                            onChange={updateField}
                                        />
                                    </div>

                                    <div className="reg-field">
                                        <label htmlFor="farm-barangayOrDaRef">Barangay / DA / RSBSA ref. no. (optional)</label>
                                        <input
                                            id="farm-barangayOrDaRef"
                                            name="barangayOrDaRef"
                                            type="text"
                                            placeholder="Speeds up farm verification"
                                            value={farm.barangayOrDaRef}
                                            onChange={updateField}
                                        />
                                    </div>
                                </div>

                                <PrivacyNotice
                                    id="farm-privacy"
                                    checked={privacyAgreed}
                                    onChange={(val) => {
                                        setPrivacyAgreed(val);
                                        setErrors((prev) => ({ ...prev, privacyAgreed: undefined }));
                                    }}
                                    error={errors.privacyAgreed}
                                    purpose="farm safety verification and student volunteer matching"
                                />

                                {errors.form && <p className="reg-error" role="alert">{errors.form}</p>}

                                <div className="reg-actions">
                                    <button type="submit" className="cta-btn reg-cta-submit" disabled={busy}>
                                        <span className="cta-btn__text">
                                            {busy ? "Submitting…" : "Submit Farm for Review"}
                                        </span>
                                        <ArrowCircleIcon className="cta-btn__icon" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </Section>
    );
}