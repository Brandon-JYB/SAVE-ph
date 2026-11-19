import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './pages/LandingPage';
import ContactPage from './pages/ContactPage';

function App() {
    return (
        <div className="app-container">
            <ScrollToTop />
            <Navbar />

            <main className="main-content">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}

export default App;