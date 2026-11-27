import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/*  ---------- COMPONENTS/FORMS ----------  */
import FormField from "./FormField";
import PrivacyNotice from "./PrivacyNotice";

/*  ---------- API ----------  */
import { getFarms, submitRegistration, saveContactPreferences } from "../../api/Client";

const STEPS = [
    "Email & Number",
    "Farm Selection",
    "Confirm Match",
    "Confirmation",
    "Keep In Touch",
];

const EMPTY_FORM = {
    fullName: "",
    email: "",
    phone: "",
    preferredDate: "",
    farmId: "",
    emailUpdates: true,
    smsUpdates: false,
    privacyAgreed: false,
};

export default function VolunteerRegisterForm({ initialStep = 0, initialRef = "" }) {
    const navigate = useNavigate();

    const [step, setStep] = useState(initialStep);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [referenceCode, setReferenceCode] = useState(initialRef);
    const [registrationDone, setRegistrationDone] = useState(false);

    const [farms, setFarms] = useState([]);
    const [farmsError, setFarmsError] = useState("");

    useEffect(() => {
        setFarmsError("");
        getFarms(form.preferredDate)
            .then(setFarms)
            .catch(() =>
                setFarmsError("We couldn't load the farm list. Refresh the page to try again.")
            );
    }, [form.preferredDate]);

    const selectedFarm = farms.find((farm) => farm.id === form.farmId);

    function updateForm(event) {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    function resetForm() {
        setForm(EMPTY_FORM);
        setStep(0);
        setReferenceCode("");
        setRegistrationDone(false);
        setErrors({});
    }

    function validateStep1() {
        const next = {};
        if (!form.fullName.trim()) next.fullName = "Enter your full name.";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
        const digits = form.phone.replace(/[\s-]/g, "");
        if (!/^(\+63|0)?9\d{9}$/.test(digits)) {
            next.phone = "Enter a valid mobile number, like 0917 123 4567.";
        }
        if (!form.preferredDate) next.preferredDate = "Pick the date you'd like to join.";
        return next;
    }

    function validateStep2() {
        return form.farmId ? {} : { farmId: "Choose a farm to continue." };
    }

    function validateStep3() {
        return form.privacyAgreed
            ? {}
            : { privacyAgreed: "Please agree to the Data Privacy Notice to confirm your match." };
    }

    function goNext() {
        const found = step === 0 ? validateStep1() : step === 1 ? validateStep2() : {};
        if (Object.keys(found).length) {
            setErrors(found);
            return;
        }
        setErrors({});
        setStep((s) => s + 1);
    }

    function goBack() {
        setErrors({});
        setStep((s) => Math.max(0, s - 1));
    }

    async function confirmMatch() {
        const found = validateStep3();
        if (Object.keys(found).length) {
            setErrors(found);
            return;
        }

        setBusy(true);
        try {
            const result = await submitRegistration(form);
            const code = result.referenceCode || "";
            setReferenceCode(code);
            setStep(3);
            navigate(
                `/verify-email?role=student&email=${encodeURIComponent(form.email)}&ref=${encodeURIComponent(code)}`
            );
        } catch (err) {
            setErrors({
                form: err.message || "We couldn't submit your registration. Try again.",
            });
        } finally {
            setBusy(false);
        }
    }

    async function finishContactPrefs() {
        setBusy(true);
        try {
            await saveContactPreferences(referenceCode, {
                emailUpdates: form.emailUpdates,
                smsUpdates: form.smsUpdates,
            });
            setRegistrationDone(true);
        } catch (err) {
            setErrors({
                form: err.message || "We couldn't save your preferences. Try again.",
            });
        } finally {
            setBusy(false);
        }
    }

    function renderStep() {
        switch (step) {
            case 0:
                return (
                    <>
                        <h2 className="reg-step-title">Your contact details</h2>
                        <FormField id="fullName" label="Full name" error={errors.fullName}>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                autoComplete="name"
                                value={form.fullName}
                                onChange={updateForm}
                                aria-invalid={!!errors.fullName}
                                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                            />
                        </FormField>
                        <FormField id="email" label="Email" error={errors.email}>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={updateForm}
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? "email-error" : undefined}
                            />
                        </FormField>
                        <FormField
                            id="phone"
                            label="Mobile number"
                            error={errors.phone}
                            hint="We use this to confirm your match."
                        >
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                value={form.phone}
                                onChange={updateForm}
                                aria-invalid={!!errors.phone}
                                aria-describedby={errors.phone ? "phone-error" : undefined}
                            />
                        </FormField>
                        <FormField id="preferredDate" label="Preferred date" error={errors.preferredDate}>
                            <input
                                id="preferredDate"
                                name="preferredDate"
                                type="date"
                                min={new Date().toISOString().slice(0, 10)}
                                value={form.preferredDate}
                                onChange={updateForm}
                                aria-invalid={!!errors.preferredDate}
                                aria-describedby={
                                    errors.preferredDate ? "preferredDate-error" : undefined
                                }
                            />
                        </FormField>
                    </>
                );

            case 1:
                return (
                    <>
                        <h2 className="reg-step-title">Choose a farm</h2>
                        <fieldset className="reg-farms">
                            <legend className="reg-sr-only">Available farms</legend>
                            {farmsError && (
                                <p className="reg-error" role="alert">
                                    {farmsError}
                                </p>
                            )}
                            {farms.map((farm) => (
                                <label key={farm.id} className="reg-farm">
                                    <input
                                        type="radio"
                                        name="farmId"
                                        value={farm.id}
                                        checked={form.farmId === farm.id}
                                        onChange={updateForm}
                                    />
                                    <span className="reg-farm__body">
                                        <span className="reg-farm__name">{farm.name}</span>
                                        <span className="reg-farm__meta">
                                            {farm.location} · {farm.focus}
                                        </span>
                                        <span className="reg-farm__slots">
                                            {farm.slots} spots left
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </fieldset>
                        {errors.farmId && (
                            <p className="reg-error" role="alert">
                                {errors.farmId}
                            </p>
                        )}
                    </>
                );

            case 2:
                return (
                    <>
                        <h2 className="reg-step-title">Confirm your match</h2>
                        <dl className="reg-summary">
                            <div>
                                <dt>Name</dt>
                                <dd>{form.fullName}</dd>
                            </div>
                            <div>
                                <dt>Email</dt>
                                <dd>{form.email}</dd>
                            </div>
                            <div>
                                <dt>Mobile</dt>
                                <dd>{form.phone}</dd>
                            </div>
                            <div>
                                <dt>Date</dt>
                                <dd>{form.preferredDate}</dd>
                            </div>
                            <div>
                                <dt>Farm</dt>
                                <dd>
                                    {selectedFarm
                                        ? `${selectedFarm.name}, ${selectedFarm.location}`
                                        : ""}
                                </dd>
                            </div>
                        </dl>
                        <p className="reg-hint">
                            Something wrong? Use Back to fix it before you confirm.
                        </p>

                        <PrivacyNotice
                            id="reg-privacy"
                            checked={form.privacyAgreed}
                            onChange={(val) => {
                                setForm((prev) => ({ ...prev, privacyAgreed: val }));
                                setErrors((prev) => ({ ...prev, privacyAgreed: undefined }));
                            }}
                            error={errors.privacyAgreed}
                            purpose="student volunteer placement and farm matching"
                        />
                    </>
                );

            case 3:
                return (
                    <div className="reg-center">
                        <h2 className="reg-step-title">You're registered</h2>
                        <p>
                            {form.email ? (
                                <>
                                    We verified and confirmed <strong>{form.email}</strong>.
                                </>
                            ) : (
                                "Your email is verified and your volunteer slot is confirmed."
                            )}
                        </p>
                        {referenceCode && (
                            <p className="reg-code">
                                Reference code: <strong>{referenceCode}</strong>
                            </p>
                        )}
                        <p className="reg-hint">
                            Keep this code. You'll need it if you want to change your registration.
                        </p>
                    </div>
                );

            case 4:
                return registrationDone ? (
                    <div className="reg-center">
                        <h2 className="reg-step-title">All set</h2>
                        <p>We'll be in touch before your visit to {selectedFarm?.name || "the farm"}.</p>
                    </div>
                ) : (
                    <>
                        <h2 className="reg-step-title">Keep in touch</h2>
                        <p>How should we reach you about your visit?</p>
                        <label className="reg-check">
                            <input
                                type="checkbox"
                                name="emailUpdates"
                                checked={form.emailUpdates}
                                onChange={updateForm}
                            />
                            <span>Email me reminders and updates</span>
                        </label>
                        <label className="reg-check">
                            <input
                                type="checkbox"
                                name="smsUpdates"
                                checked={form.smsUpdates}
                                onChange={updateForm}
                            />
                            <span>Text me reminders</span>
                        </label>
                    </>
                );

            default:
                return null;
        }
    }

    function renderActions() {
        if (step === 0) {
            return (
                <button type="button" className="reg-btn" onClick={goNext}>
                    Choose a farm
                </button>
            );
        }
        if (step === 1) {
            return (
                <>
                    <button type="button" className="reg-btn reg-btn--ghost" onClick={goBack}>
                        Back
                    </button>
                    <button type="button" className="reg-btn" onClick={goNext}>
                        Review match
                    </button>
                </>
            );
        }
        if (step === 2) {
            return (
                <>
                    <button
                        type="button"
                        className="reg-btn reg-btn--ghost"
                        onClick={goBack}
                        disabled={busy}
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        className="reg-btn"
                        onClick={confirmMatch}
                        disabled={busy}
                    >
                        {busy ? "Confirming…" : "Confirm & verify email"}
                    </button>
                </>
            );
        }
        if (step === 3) {
            return (
                <button type="button" className="reg-btn" onClick={() => setStep(4)}>
                    Set contact preferences
                </button>
            );
        }
        if (step === 4 && !registrationDone) {
            return (
                <button
                    type="button"
                    className="reg-btn"
                    onClick={finishContactPrefs}
                    disabled={busy}
                >
                    {busy ? "Saving…" : "Save preferences"}
                </button>
            );
        }
        return (
            <button type="button" className="reg-btn reg-btn--ghost" onClick={resetForm}>
                Register someone else
            </button>
        );
    }

    return (
        <>
            <ol className="reg-steps" aria-label="Registration progress">
                {STEPS.map((label, index) => (
                    <li
                        key={label}
                        className={
                            "reg-steps__item" +
                            (index === step ? " is-current" : "") +
                            (index < step || registrationDone ? " is-done" : "")
                        }
                        aria-current={index === step ? "step" : undefined}
                    >
                        <span className="reg-steps__num">{index + 1}</span>
                        <span className="reg-steps__label">{label}</span>
                    </li>
                ))}
            </ol>
            <div className="reg-panel">
                {renderStep()}
                {errors.form && (
                    <p className="reg-error" role="alert">
                        {errors.form}
                    </p>
                )}
                <div className="reg-actions">{renderActions()}</div>
            </div>
        </>
    );
}