import { Link } from "react-router-dom";
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
    const active = useActiveSection(SECTION_IDS);

    return (
        <div className="box">
            <nav className="navbar">
                <Link to="/#Home" className="logo-container" aria-label="Save Philippines, back to the top">
                    <img src={logo} alt="Save Philippines logo" />
                </Link>

                <div className="nav-links">
                    {NAV_LINKS.map(({ id, label }) => (
                        <Link
                            key={id}
                            to={`/#${id}`}
                            className={active === id ? "is-active" : ""}
                        >
                            {label}
                        </Link>
                    ))}

                    <Link to="/contact" className="contact-link">
                        <div className="special-bg" />
                        <span>Contact</span>
                    </Link>
                </div>

                <div className="status-pill">
                    <span className="status-pill__dot" aria-hidden="true" />
                    <span className="status-pill__text">open for volunteers</span>
                </div>
            </nav>
        </div>
    );
}