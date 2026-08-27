import { useNavigate } from 'react-router-dom';
import ParchmentCard from '../components/ParchmentCard';

// TEMPORARY: this gets replaced with the full dashboard (Profile, Today,
// Chat, and the 6-button feature grid from the mockup) in the next step.
// It exists now purely so login/signup have somewhere real to land and the
// full auth flow can be tested end-to-end.
export default function DashboardPlaceholder() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    navigate('/login');
  }

  return (
    <div className="app-shell flex items-center justify-center px-4 py-10">
      <div className="relative z-10 w-full max-w-lg text-center">
        <ParchmentCard>
          <h1 className="gold-heading text-2xl mb-2">வணக்கம்!</h1>
          <p className="font-manuscript italic mb-6">
            உள்நுழைவு வெற்றி! முழு டாஷ்போர்டு அடுத்த கட்டத்தில் வருகிறது.
          </p>
          <button className="btn-gold" onClick={handleLogout}>வெளியேறு</button>
        </ParchmentCard>
      </div>
    </div>
  );
}
