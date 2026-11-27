export default function PrivacyNotice({ id = "privacyAgreed", checked, onChange, error, purpose = "volunteer coordination" }) {
    return (
        <div className="reg-privacy">
            <p className="reg-privacy__text">
                <strong>Data Privacy Notice (RA 10173):</strong> Save Philippines (Save PH) collects your
                personal and contact details solely for {purpose}, email verification, and student-farm
                safety coordination. Your data will never be sold or shared with unauthorized third parties.
            </p>
            <label className="reg-check" htmlFor={id}>
                <input
                    id={id}
                    name={id}
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
                <span>I have read and agree to the Save PH Data Privacy Notice.</span>
            </label>
            {error && (
                <p className="reg-error" id={`${id}-error`} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}