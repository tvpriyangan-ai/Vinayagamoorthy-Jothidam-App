import { useNavigate } from 'react-router-dom';

export default function AppHeader({ userName }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    navigate('/login');
  }

  return (
    <header className="parchment flex items-center justify-between px-5 py-3 mb-4">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="logo" className="w-11 h-11 rounded-full border-2 border-gold" />
        <div>
          <h1 className="brand-wordmark text-lg leading-none">VINAYAGAMOORTHY</h1>
          <p className="text-xs opacity-80 tracking-widest">VEDIC ASTROLOGY SOFTWARE</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm hidden sm:inline">
          Welcome, <strong>{userName || '...'}</strong>
        </span>
        <button onClick={handleLogout} className="btn-gold !py-1.5 !px-3 text-sm">
          வெளியேறு
        </button>
      </div>
    </header>
  );
}
