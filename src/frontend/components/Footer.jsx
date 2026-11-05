import React from "react";
import "../css/style.css";

// Asset placeholders - replace with actual paths if importing files locally
const topDecorationLine = "";
const bottomDecorationLine = "";
const buttonBackground = "";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="branding">
                <h3 className="brand-title">
                    SAVE PHILIPPINES
                </h3>
                <p className="slogan">
                    <span className="slogan-text">The future grows with </span>
                    <span className="slogan-highlight">you</span>
                    <span className="slogan-text">th.</span>
                </p>

                <button className="cta-button" type="button">
                    <span className="cta-text">Volunteer Now</span>
                    <img className="cta-bg" alt="" src={buttonBackground} />
                        {/* Placeholder SVG for ArrowRightCircle */}
                        <svg 
                        className="cta-icon" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        width="24"
                        height="24"
                        >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16l4-4-4-4" />
                        <path d="M8 12h8" />
                        </svg>
                </button>
            </div>

            <div className="links-section">
                <div className="column">
                    <h4 className="column-title">PAGE</h4>
                    <a href="#home" className="link">Home</a>
                    <a href="#about" className="link">About</a>
                    <a href="#process" className="link">Process</a>
                    <a href="#faq" className="link">FAQ</a>
                    <a href="#discover" className="link">Discover</a>
                </div>
                <div className="column">
                    <h4 className="column-title">CONNECT</h4>
                    <a href="#register" className="link">Register</a>
                    <a href="#email" className="link">Email</a>
                </div>
            </div>

            <div className="tagline-group">
                <img className="decorative-line"/>
                <p className="mission-text">
                    SUPPORTING AGRICULTURE VIA VOLUNTEER ENGAGEMENT
                </p>
                <img className="decorative-line"/>
            </div>

            <p className="copyright">© 2026 • SAVE PH</p>
        </footer>
    );
}