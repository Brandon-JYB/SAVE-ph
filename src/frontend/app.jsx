import React from 'react'
import './css/style.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
    return (
        <>
        <Navbar />
        
        <main className="main-content">
            <h1>Welcome to My App</h1>
            <p>This is where the main content of your page will live.</p>
        </main>

        <Footer />
        </>
    )
}
export default App