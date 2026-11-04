import React from 'react'
import Navbar from './components/Navbar'
import './css/style.css'

function App() {
    return (
        <>
        <Navbar />
        
        <main className="main-content">
            <h1>Welcome to My App</h1>
            <p>This is where the main content of your page will live.</p>
        </main>
        </>
    )
}
export default App