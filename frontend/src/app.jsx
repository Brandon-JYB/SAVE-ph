import { Routes, Route } from 'react-router-dom';

/*  ---------- COMPONENTS/LAYOUT ----------  */
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';

/*  ---------- PAGES ----------  */
import LandingPage from './pages/LandingPage';
import ContactPage from './pages/ContactPage';
import PredictionsPage from './pages/PredictionsPage';
import FarmerRegisterPage from "./pages/FarmerRegisterPage";
import FarmRegistrationPage from "./pages/FarmRegistrationPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import PrivacyPage from "./pages/PrivacyPage";

function App() {
    return (
        <div className="app-container">
            <ScrollToTop />
            <Navbar />

            <main className="main-content">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/predictions" element={<PredictionsPage />} />
                    <Route path="/farmer-signup" element={<FarmerRegisterPage />} />
                    <Route path="/register-farm" element={<FarmRegistrationPage />} />
                    <Route path="/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}

export default App;