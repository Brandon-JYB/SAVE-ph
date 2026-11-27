export default function FormField({ id, label, error, hint, children }) {
    return (
        <div className="reg-field">
            <label htmlFor={id}>{label}</label>
            {children}
            {hint && !error && <p className="reg-hint">{hint}</p>}
            {error && (
                <p className="reg-error" id={`${id}-error`} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}