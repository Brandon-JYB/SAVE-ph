import { useState } from "react";

/*  ---------- COMPONENTS/FORMS ----------  */
import FormField from "./FormField";
import PrivacyNotice from "./PrivacyNotice";

/*  ---------- API ----------  */
import { submitInquiry } from "../../api/Client";

const TOPICS = [
    { value: "general", label: "General question" },
    { value: "requirements", label: "Requirements & eligibility" },
    { value: "farms", label: "Farms & locations" },
    { value: "safety", label: "Safety & what to bring" },
    { value: "partnership", label: "Schools & partnerships" },
];

const EMPTY_INQUIRY = {
    fullName: "",
    email: "",
    topic: "general",
    message: "",
    privacyAgreed: false,
};

export default function InquiryForm() {
    const [inquiry, setInquiry] = useState(EMPTY_INQUIRY);
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);

    function updateInquiry(event) {
        const { name, value, type, checked } = event.target;
        setInquiry((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    function resetForm() {
        setInquiry(EMPTY_INQUIRY);
        setDone(false);
        setErrors({});
    }

    function validate() {
        const next = {};
        if (!inquiry.fullName.trim()) next.fullName = "Enter your name.";
        if (!/^\S+@\S+\.\S+$/.test(inquiry.email)) next.email = "Enter an email we can reply to.";
        if (inquiry.message.trim().length < 10) {
            next.message = "Write your question so we can help (a sentence or two is plenty).";
        }
        if (!inquiry.privacyAgreed) {
            next.privacyAgreed = "Please agree to the Data Privacy Notice before sending.";
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
            await submitInquiry(inquiry);
            setDone(true);
        } catch {
            setErrors({ form: "We couldn't send your question. Try again." });
        } finally {
            setBusy(false);
        }
    }

    if (done) {
        return (
            <div className="reg-center">
                <h2 className="reg-step-title">Question sent</h2>
                <p>
                    We'll reply to <strong>{inquiry.email}</strong> as soon as we can.
                </p>
                <div className="reg-actions">
                    <button type="button" className="reg-btn reg-btn--ghost" onClick={resetForm}>
                        Ask another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2 className="reg-step-title">What would you like to know?</h2>
            <FormField id="inq-fullName" label="Your name" error={errors.fullName}>
                <input
                    id="inq-fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    value={inquiry.fullName}
                    onChange={updateInquiry}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? "inq-fullName-error" : undefined}
                />
            </FormField>
            <FormField id="inq-email" label="Email" error={errors.email} hint="We'll reply here.">
                <input
                    id="inq-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={inquiry.email}
                    onChange={updateInquiry}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "inq-email-error" : undefined}
                />
            </FormField>
            <FormField id="inq-topic" label="Topic">
                <select
                    id="inq-topic"
                    name="topic"
                    value={inquiry.topic}
                    onChange={updateInquiry}
                >
                    {TOPICS.map((t) => (
                        <option key={t.value} value={t.value}>
                            {t.label}
                        </option>
                    ))}
                </select>
            </FormField>
            <FormField id="inq-message" label="Your question" error={errors.message}>
                <textarea
                    id="inq-message"
                    name="message"
                    rows="5"
                    value={inquiry.message}
                    onChange={updateInquiry}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "inq-message-error" : undefined}
                />
            </FormField>

            <PrivacyNotice
                id="inq-privacy"
                checked={inquiry.privacyAgreed}
                onChange={(val) => {
                    setInquiry((prev) => ({ ...prev, privacyAgreed: val }));
                    setErrors((prev) => ({ ...prev, privacyAgreed: undefined }));
                }}
                error={errors.privacyAgreed}
                purpose="answering your volunteer inquiry"
            />

            {errors.form && (
                <p className="reg-error" role="alert">
                    {errors.form}
                </p>
            )}

            <div className="reg-actions">
                <button type="submit" className="reg-btn" disabled={busy}>
                    {busy ? "Sending…" : "Send question"}
                </button>
            </div>
        </form>
    );
}