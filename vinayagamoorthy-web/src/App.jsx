import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
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
import DeleteAccountPage from './pages/DeleteAccountPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ProtectedRoute from './components/ProtectedRoute';
import MusicPlayer from './components/MusicPlayer';

function Protected(element) {
  return <ProtectedRoute>{element}</ProtectedRoute>;
}

// Keyed on the language so switching it remounts every page — each page's
// data load re-runs and comes back localised. (Stays on the same route.)
function AppRoutes() {
  const { language } = useLanguage();
  return (
    <div key={language}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/delete-account" element={<DeleteAccountPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />

        <Route path="/dashboard" element={Protected(<DashboardPage />)} />

        {/* Feature pages */}
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
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AppRoutes />
        <MusicPlayer />
      </LanguageProvider>
    </BrowserRouter>
  );
}
