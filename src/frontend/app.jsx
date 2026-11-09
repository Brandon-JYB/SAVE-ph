import React from 'react'
import './css/style.css'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'; 

function App() {
    return (
        <>
        <Navbar />
        
        <main className="main-content">
            <LandingPage />
        </main>

        <Footer />
        </>
    )
}
export default App