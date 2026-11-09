import React from 'react';
import "../css/style.css"; 

export default function NavBar() {
    return (
        <div className='box'>
            <nav className='navbar'>
                <div className="logo-container">[LOGO]</div>
                
                <ul className='nav-links'>
                    <a href="#Home">Home</a>
                    <a href="#About">About</a>
                    <a href="#Process">Process</a>
                    <a href="#Questions">Questions</a>
                    <a href="#Discover">Discover</a>
                    <a href="#Register" className="contact-link">
                        <div className="special-bg" />
                        <span>Contact</span>
                    </a>
                </ul>
                
                <button className="account-btn">
                    <div className="action-bg" />
                    <span>Account</span>
                </button>
            </nav>
        </div>
    );
}