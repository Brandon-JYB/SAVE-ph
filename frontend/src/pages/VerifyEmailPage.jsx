import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

/*  ---------- COMPONENTS ----------  */
import Section from "../components/layout/Section";

/*  ---------- SVG ----------  */
import ArrowCircleIcon from "../svg/ArrowCircleIcon";

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get("email") || "";
    const farm = searchParams.get("farm") || "";
    const refCode = searchParams.get("ref") || "";
    const role = searchParams.get("role") === "farmer" ? "farmer" : "student";

    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const [busy, setBusy] = useState(false);
    const [verified, setVerified] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    function handleDigitChange(index, rawValue) {
        const clean = rawValue.replace(/\D/g, "");
        if (!clean) {
            const next = [...digits];
            next[index] = "";
            setDigits(next);
            return;
        }

        // Support pasting full 6-digit code into any box
        if (clean.length > 1) {
            const slice = clean.slice(0, 6).split("");
            const next = ["", "", "", "", "", ""];
            slice.forEach((ch, i) => {
                next[i] = ch;
            });
            setDigits(next);
            setError("");
            const focusIdx = Math.min(slice.length, 5);
            inputRefs.current[focusIdx]?.focus();
            return;
        }

        const next = [...digits];
        next[index] = clean;
        setDigits(next);
        setError("");
        if (index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(index, event) {
        if (event.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    async function handleVerify(event) {
        event.preventDefault();
        setError("");
        setInfo("");

        const code = digits.join("");
        if (code.length !== 6) {
            setError("Enter all 6 digits from your verification email.");
            return;
        }

        setBusy(true);
        try {
            // TODO: Wire to FastAPI email verification endpoint
            await new Promise((resolve) => setTimeout(resolve, 500));
            setVerified(true);
            setTimeout(() => {
                if (role === "farmer") {
                    navigate(
                        `/register-farm?email=${encodeURIComponent(email)}&farm=${encodeURIComponent(farm)}&verified=1`
                    );
                } else {
                    navigate(`/contact?verified=1&ref=${encodeURIComponent(refCode)}`);
                }
            }, 1300);
        } catch (err) {
            setError(err.message || "Invalid or expired code. Check your inbox and try again.");
        } finally {
            setBusy(false);
        }
    }

    function handleResend() {
        if (cooldown > 0) return;
        setError("");
        setCooldown(60);
        setInfo(`Sent a fresh 6-digit code to ${email || "your inbox"}.`);
    }

    return (
        <Section id="VerifyEmail" tone="light" watermark="VERIFY">
            <div className="reg reg--narrow">
                <header className="reg-header reg-header--ruled">
                    <p className="reg-eyebrow">
                        {role === "farmer" ? "farmer partner check" : "volunteer check"}
                    </p>
                    <h1>Verify your email</h1>
                    <p className="reg-lede">confirming {email || "your account"}</p>
                </header>

                <div className="reg-card">
                    <div className="otp-banner">
                        <span className="bento__label">ONE-TIME PASSCODE</span>
                        <p>
                            Enter the 6-digit code sent to{" "}
                            <strong>{email || "your email address"}</strong>.
                        </p>
                    </div>

                    <div className="reg-panel">
                        {verified ? (
                            <div className="reg-center reg-success-box">
                                <span className="reg-code">VERIFIED ✓</span>
                                <h2 className="reg-step-title">Email confirmed!</h2>
                                <p>
                                    {role === "farmer"
                                        ? "Opening your Farm & Student Safety Registration form…"
                                        : "Finalizing your volunteer match…"}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleVerify} noValidate>
                                <div className="otp-boxes" role="group" aria-label="6-digit verification code">
                                    {digits.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={digit}
                                            onChange={(e) => handleDigitChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            aria-label={`Digit ${index + 1}`}
                                            aria-invalid={!!error}
                                            className="otp-box"
                                        />
                                    ))}
                                </div>

                                {error && (
                                    <p className="reg-error reg-center" role="alert">
                                        {error}
                                    </p>
                                )}
                                {info && <p className="reg-hint reg-center">{info}</p>}

                                <div className="reg-actions reg-actions--between">
                                    <button
                                        type="button"
                                        className="reg-btn reg-btn--ghost"
                                        onClick={handleResend}
                                        disabled={cooldown > 0}
                                    >
                                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                                    </button>
                                    <button type="submit" className="cta-btn reg-cta-submit" disabled={busy}>
                                        <span className="cta-btn__text">
                                            {busy ? "Checking…" : "Confirm"}
                                        </span>
                                        <ArrowCircleIcon className="cta-btn__icon" />
                                    </button>
                                </div>
                            </form>
                        )}

                        <p className="reg-switch-link">
                            Entered the wrong email?{" "}
                            <Link to={role === "farmer" ? "/farmer-signup" : "/contact"}>
                                Go back and fix it
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    );
}