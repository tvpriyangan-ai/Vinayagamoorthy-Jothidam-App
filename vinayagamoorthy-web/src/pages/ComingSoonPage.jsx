import { useNavigate, useLocation } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import ParchmentCard from '../components/ParchmentCard';

export default function ComingSoonPage({ title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = title || location.state?.title || 'இந்த பகுதி';

  return (
    <div className="app-shell px-4 py-4 max-w-5xl mx-auto">
      <AppHeader />
      <ParchmentCard className="text-center py-12">
        <h2 className="parchment-heading text-2xl mb-3">{pageTitle}</h2>
        <p className="font-manuscript italic opacity-80 mb-6">
          இந்த பகுதி விரைவில் கிடைக்கும் — தற்போது உருவாக்கப்பட்டு வருகிறது.
        </p>
        <button className="btn-gold" onClick={() => navigate('/dashboard')}>
          டாஷ்போர்டுக்குத் திரும்பவும்
        </button>
      </ParchmentCard>
    </div>
  );
}
