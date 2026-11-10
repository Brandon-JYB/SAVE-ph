import React from 'react';
import "../css/style.css";
import useActiveSection from "../hooks/useActiveSection";

const SECTION_IDS = ["Home", "About", "Process", "Questions", "Discover"];

export default function NavBar() {
    const active = useActiveSection(SECTION_IDS);

    return (
        <div className="box">
            <nav className="navbar">
                <div className="logo-container">[LOGO]</div>

                <div className="nav-links">
                    <a href="#Home"      className={active === "Home" ? "is-active" : ""}>Home</a>
                    <a href="#About"     className={active === "About" ? "is-active" : ""}>About</a>
                    <a href="#Process"   className={active === "Process" ? "is-active" : ""}>Process</a>
                    <a href="#Questions" className={active === "Questions" ? "is-active" : ""}>Questions</a>
                    <a href="#Discover"  className={active === "Discover" ? "is-active" : ""}>Discover</a>
                    <a href="#Register" className="contact-link">
                        <div className="special-bg" />
                        <span>Contact</span>
                    </a>
                </div>

                <button className="account-btn">
                    <div className="action-bg" />
                    <span>Account</span>
                </button>
            </nav>
        </div>
    );
}