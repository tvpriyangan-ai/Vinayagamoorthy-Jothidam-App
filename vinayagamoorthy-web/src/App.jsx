import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import JathagamPage from './pages/JathagamPage';
import MatchingPage from './pages/MatchingPage';
import LuckyNotesPage from './pages/LuckyNotesPage';
import TemplesPage from './pages/TemplesPage';
import PanchangamPage from './pages/PanchangamPage';
import DoshaPage from './pages/DoshaPage';
import TransitPage from './pages/TransitPage';
import VastuPage from './pages/VastuPage';
import ProfilePage from './pages/ProfilePage';
import ContentPage from './pages/ContentPage';
import ContactPage from './pages/ContactPage';
import ProtectedRoute from './components/ProtectedRoute';

function Protected(element) {
  return <ProtectedRoute>{element}</ProtectedRoute>;
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/dashboard" element={Protected(<DashboardPage />)} />

        {/* Feature pages — now built for real */}
        <Route path="/jathagam" element={Protected(<JathagamPage />)} />
        <Route path="/matching" element={Protected(<MatchingPage />)} />
        <Route path="/lucky-notes" element={Protected(<LuckyNotesPage />)} />
        <Route path="/temples" element={Protected(<TemplesPage />)} />
        <Route path="/panchangam" element={Protected(<PanchangamPage />)} />
        <Route path="/dosha" element={Protected(<DoshaPage />)} />
        <Route path="/transit" element={Protected(<TransitPage />)} />
        <Route path="/vastu" element={Protected(<VastuPage />)} />
        <Route path="/profile" element={Protected(<ProfilePage />)} />
        <Route path="/content/:category" element={Protected(<ContentPage />)} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
}
