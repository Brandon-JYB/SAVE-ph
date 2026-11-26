import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

/*  ---------- COMPONENTS/LAYOUT ----------  */
import Section from "../components/layout/Section";

/*  ---------- COMPONENTS/FORMS ----------  */
import VolunteerRegisterForm from "../components/forms/VolunteerRegisterForm";
import FeedbackForm from "../components/forms/FeedbackForm";
import InquiryForm from "../components/forms/InquiryForm";

const MODES = [
    {
        id: "register",
        label: "Register",
        eyebrow: "ready to join?",
        title: "Register here",
        lede: "Five quick steps and you're matched with a farm.",
    },
    {
        id: "feedback",
        label: "Feedback",
        eyebrow: "welcome back",
        title: "Share your feedback",
        lede: "Already volunteered with us? Tell us how it went.",
    },
    {
        id: "inquiry",
        label: "Ask Question",
        eyebrow: "not sure yet?",
        title: "Ask us anything",
        lede: "Got a question the site doesn't answer? Send it over and we'll reply by email.",
    },
];

export default function ContactPage() {
    const [searchParams] = useSearchParams();
    const requestedMode = searchParams.get("mode");
    const isVerifiedReturn = searchParams.get("verified") === "1";
    const refCode = searchParams.get("ref") || "";
    const isValidMode = MODES.some((m) => m.id === requestedMode);

    const [mode, setMode] = useState(isValidMode ? requestedMode : "register");

    useEffect(() => {
        if (isValidMode) setMode(requestedMode);
    }, [requestedMode, isValidMode]);

    const current = MODES.find((m) => m.id === mode);

    return (
        <Section id="Contact" tone="light">
            <div className="reg">
                <header className="reg-header">
                    <p className="reg-eyebrow">{current.eyebrow}</p>
                    <h1>{current.title}</h1>
                    <p className="reg-lede">{current.lede}</p>
                </header>

                <p className="reg-switch-banner">
                    Own a local farm?{" "}
                    <Link to="/farmer-signup">Register your farm to host student volunteers →</Link>
                </p>

                <div className="reg-modes" role="group" aria-label="What would you like to do?">
                    {MODES.map((m) => (
                        <button
                            key={m.id}
                            type="button"
                            className={"reg-mode" + (mode === m.id ? " is-active" : "")}
                            aria-pressed={mode === m.id}
                            onClick={() => setMode(m.id)}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                <div className="reg-card">
                    {mode === "register" && (
                        <VolunteerRegisterForm
                            initialStep={isVerifiedReturn ? 3 : 0}
                            initialRef={refCode}
                        />
                    )}
                    {mode === "feedback" && (
                        <div className="reg-panel">
                            <FeedbackForm />
                        </div>
                    )}
                    {mode === "inquiry" && (
                        <div className="reg-panel">
                            <InquiryForm />
                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
}