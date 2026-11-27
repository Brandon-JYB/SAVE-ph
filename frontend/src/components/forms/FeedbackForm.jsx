import { useEffect, useState } from "react";

/*  ---------- COMPONENTS/FORMS ----------  */
import FormField from "./FormField";
import PrivacyNotice from "./PrivacyNotice";

/*  ---------- API ----------  */
import { getFarms, submitFeedback } from "../../api/Client";

const EMPTY_FEEDBACK = {
    fullName: "",
    email: "",
    farmId: "",
    rating: "",
    comments: "",
    canShare: false,
    privacyAgreed: false,
};

export default function FeedbackForm() {
    const [feedback, setFeedback] = useState(EMPTY_FEEDBACK);
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);
    const [farms, setFarms] = useState([]);

    useEffect(() => {
        getFarms("")
            .then(setFarms)
            .catch(() => setFarms([]));
    }, []);

    function updateFeedback(event) {
        const { name, value, type, checked } = event.target;
        setFeedback((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    function resetForm() {
        setFeedback(EMPTY_FEEDBACK);
        setDone(false);
        setErrors({});
    }

    function validate() {
        const next = {};
        if (!feedback.fullName.trim()) next.fullName = "Enter your full name.";
        if (!/^\S+@\S+\.\S+$/.test(feedback.email)) {
            next.email = "Enter the email you registered with.";
        }
        if (!feedback.farmId) next.farmId = "Choose the farm you volunteered at.";
        if (!feedback.rating) next.rating = "Choose a rating.";
        if (!feedback.comments.trim()) next.comments = "Tell us a little about how it went.";
        if (!feedback.privacyAgreed) {
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
            await submitFeedback(feedback);
            setDone(true);
        } catch {
            setErrors({ form: "We couldn't send your feedback. Try again." });
        } finally {
            setBusy(false);
        }
    }

    if (done) {
        return (
            <div className="reg-center">
                <h2 className="reg-step-title">Thanks for the feedback</h2>
                <p>It helps us improve the program for the next group of volunteers.</p>
                <div className="reg-actions">
                    <button type="button" className="reg-btn reg-btn--ghost" onClick={resetForm}>
                        Done
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2 className="reg-step-title">How did it go?</h2>
            <FormField id="fb-fullName" label="Full name" error={errors.fullName}>
                <input
                    id="fb-fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    value={feedback.fullName}
                    onChange={updateFeedback}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? "fb-fullName-error" : undefined}
                />
            </FormField>
            <FormField id="fb-email" label="Email you registered with" error={errors.email}>
                <input
                    id="fb-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={feedback.email}
                    onChange={updateFeedback}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "fb-email-error" : undefined}
                />
            </FormField>
            <FormField id="fb-farmId" label="Farm you volunteered at" error={errors.farmId}>
                <select
                    id="fb-farmId"
                    name="farmId"
                    value={feedback.farmId}
                    onChange={updateFeedback}
                    aria-invalid={!!errors.farmId}
                    aria-describedby={errors.farmId ? "fb-farmId-error" : undefined}
                >
                    <option value="">Select a farm</option>
                    {farms.map((farm) => (
                        <option key={farm.id} value={farm.id}>
                            {farm.name}
                        </option>
                    ))}
                </select>
            </FormField>

            <fieldset className="reg-rating">
                <legend>Overall experience</legend>
                {[1, 2, 3, 4, 5].map((n) => (
                    <label key={n}>
                        <input
                            type="radio"
                            name="rating"
                            value={String(n)}
                            checked={feedback.rating === String(n)}
                            onChange={updateFeedback}
                        />
                        <span>{n}</span>
                    </label>
                ))}
                <p className="reg-hint">1 = poor, 5 = great</p>
            </fieldset>
            {errors.rating && (
                <p className="reg-error" role="alert">
                    {errors.rating}
                </p>
            )}

            <FormField
                id="fb-comments"
                label="What went well, and what should we change?"
                error={errors.comments}
            >
                <textarea
                    id="fb-comments"
                    name="comments"
                    rows="5"
                    value={feedback.comments}
                    onChange={updateFeedback}
                    aria-invalid={!!errors.comments}
                    aria-describedby={errors.comments ? "fb-comments-error" : undefined}
                />
            </FormField>

            <label className="reg-check">
                <input
                    type="checkbox"
                    name="canShare"
                    checked={feedback.canShare}
                    onChange={updateFeedback}
                />
                <span>You can share my feedback on the website</span>
            </label>

            <PrivacyNotice
                id="fb-privacy"
                checked={feedback.privacyAgreed}
                onChange={(val) => {
                    setFeedback((prev) => ({ ...prev, privacyAgreed: val }));
                    setErrors((prev) => ({ ...prev, privacyAgreed: undefined }));
                }}
                error={errors.privacyAgreed}
                purpose="volunteer program feedback and evaluation"
            />

            {errors.form && (
                <p className="reg-error" role="alert">
                    {errors.form}
                </p>
            )}

            <div className="reg-actions">
                <button type="submit" className="reg-btn" disabled={busy}>
                    {busy ? "Sending…" : "Send feedback"}
                </button>
            </div>
        </form>
    );
}