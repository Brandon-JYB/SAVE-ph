import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/style.css";
import logo from "../images/SAVE.png";
import useActiveSection from "../hooks/useActiveSection";

const NAV_LINKS = [
    { id: "Home", label: "Home" },
    { id: "About", label: "About" },
    { id: "Process", label: "Process" },
    { id: "Questions", label: "Questions" },
    { id: "Discover", label: "Discover" },
];

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

export default function NavBar() {
    const scrollActive = useActiveSection(SECTION_IDS);
    const { key, pathname } = useLocation();
    const active = pathname === "/predictions" ? "Discover" : scrollActive;

    const linkRefs = useRef({});
    const [indicator, setIndicator] = useState({ x: 0, width: 0, visible: false });
    const [ready, setReady] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // slide the green pill under the active link
    useLayoutEffect(() => {
        let alive = true;

        const measure = () => {
            if (!alive) return;
            const el = linkRefs.current[active];
            if (el) setIndicator({ x: el.offsetLeft, width: el.offsetWidth, visible: true });
            else setIndicator((prev) => ({ ...prev, visible: false }));
        };

        measure();
        window.addEventListener("resize", measure);
        document.fonts?.ready.then(measure);                          // link widths change once the fonts load
        const frame = requestAnimationFrame(() => setReady(true));    // no sliding on the very first paint

        return () => {
            alive = false;
            window.removeEventListener("resize", measure);
            cancelAnimationFrame(frame);
        };
    }, [active]);

    // phone menu: close after any navigation, and on Escape
    useEffect(() => {
        setMenuOpen(false);
    }, [key]);

    useEffect(() => {
        if (!menuOpen) return undefined;
        const onKey = (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [menuOpen]);

    return (
        <div className="box">
            <nav className="navbar">
                <Link to="/#Home" className="logo-container" aria-label="Save Philippines, back to the top">
                    <img src={logo} alt="Save Philippines logo" />
                </Link>

                <div id="nav-menu" className={"nav-links" + (menuOpen ? " is-open" : "")}>
                    <span
                        className={
                            "nav-indicator" +
                            (indicator.visible ? " is-visible" : "") +
                            (ready ? " is-ready" : "")
                        }
                        style={{ width: indicator.width, transform: `translateX(${indicator.x}px)` }}
                        aria-hidden="true"
                    />

                    {NAV_LINKS.map(({ id, label }) => (
                        <Link
                            key={id}
                            to={`/#${id}`}
                            className={active === id ? "is-active" : ""}
                            ref={(el) => {
                                linkRefs.current[id] = el;
                            }}
                        >
                            {label}
                        </Link>
                    ))}

                    <Link to="/contact" className="contact-link">
                        <div className="special-bg" />
                        <span>Contact</span>
                    </Link>
                </div>

                <div className="navbar__end">
                    <div className="status-pill">
                        <span className="status-pill__dot" aria-hidden="true" />
                        <span className="status-pill__text">open for volunteers</span>
                    </div>

                    <button
                        type="button"
                        className="nav-burger"
                        aria-expanded={menuOpen}
                        aria-controls="nav-menu"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        <span className="nav-burger__bar" />
                        <span className="nav-burger__bar" />
                        <span className="nav-burger__bar" />
                    </button>
                </div>
            </nav>
        </div>
    );
}