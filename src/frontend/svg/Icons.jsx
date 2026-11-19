function Svg({ className, children }) {
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
            {children}
        </svg>
    );
}

/* ---------- Why Do It ---------- */

export function WheatIcon({ className }) {
    return (
        <Svg className={className}>
            <path d="M12 21.5V8" />
            <ellipse cx="12" cy="5.2" rx="1.7" ry="2.7" />
            <ellipse cx="9.4" cy="9.8" rx="1.6" ry="2.6" transform="rotate(-35 9.4 9.8)" />
            <ellipse cx="9.4" cy="14.8" rx="1.6" ry="2.6" transform="rotate(-35 9.4 14.8)" />
            <ellipse cx="14.6" cy="9.8" rx="1.6" ry="2.6" transform="rotate(35 14.6 9.8)" />
            <ellipse cx="14.6" cy="14.8" rx="1.6" ry="2.6" transform="rotate(35 14.6 14.8)" />
        </Svg>
    );
}

export function HourglassIcon({ className }) {
    return (
        <Svg className={className}>
            <path d="M6 3h12" />
            <path d="M6 21h12" />
            <path d="M8 3v4l4 5-4 5v4" />
            <path d="M16 3v4l-4 5 4 5v4" />
        </Svg>
    );
}

export function MythIcon({ className }) {
    return (
        <Svg className={className}>
            <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-4.5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
            <path d="M9.5 8.5l5 5" />
            <path d="M14.5 8.5l-5 5" />
        </Svg>
    );
}

/* ---------- Process ---------- */

export function MailIcon({ className }) {
    return (
        <Svg className={className}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
        </Svg>
    );
}

export function PinIcon({ className }) {
    return (
        <Svg className={className}>
            <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
            <circle cx="12" cy="10" r="2.5" />
        </Svg>
    );
}

export function CheckCircleIcon({ className }) {
    return (
        <Svg className={className}>
            <circle cx="12" cy="12" r="9" />
            <path d="M8 12.5l2.7 2.7L16 9.5" />
        </Svg>
    );
}

export function SendIcon({ className }) {
    return (
        <Svg className={className}>
            <path d="M21 3L10.5 13.5" />
            <path d="M21 3l-6.5 18-4-7.5L3 9.5 21 3z" />
        </Svg>
    );
}

export function HeartIcon({ className }) {
    return (
        <Svg className={className}>
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
        </Svg>
    );
}

/* ---------- Controls ---------- */

export function ChevronIcon({ className }) {
    return (
        <Svg className={className}>
            <path d="M9 6l6 6-6 6" />
        </Svg>
    );
}