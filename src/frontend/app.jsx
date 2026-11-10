import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './css/style.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage'; 
import RegisterPage from './pages/RegisterPage';

function App() {
    return (
        <Router>
            <Navbar />
            
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
            </main>

            <Footer />
        </Router>
    );
}
export default App;