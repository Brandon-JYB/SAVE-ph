export default function WheatIcon({ className }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M12 21.5V8" />
            <ellipse cx="12" cy="5.2" rx="1.7" ry="2.7" />
            <ellipse cx="9.4" cy="9.8" rx="1.6" ry="2.6" transform="rotate(-35 9.4 9.8)" />
            <ellipse cx="9.4" cy="14.8" rx="1.6" ry="2.6" transform="rotate(-35 9.4 14.8)" />
            <ellipse cx="14.6" cy="9.8" rx="1.6" ry="2.6" transform="rotate(35 14.6 9.8)" />
            <ellipse cx="14.6" cy="14.8" rx="1.6" ry="2.6" transform="rotate(35 14.6 14.8)" />
        </svg>
    );
}
