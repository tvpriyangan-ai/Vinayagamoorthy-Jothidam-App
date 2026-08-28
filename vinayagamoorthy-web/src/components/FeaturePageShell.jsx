import { Link } from 'react-router-dom';
import AppHeader from './AppHeader';

export default function FeaturePageShell({ title, subtitle, children, wide = false }) {
  return (
    <div className={`app-shell px-4 py-4 mx-auto ${wide ? 'max-w-5xl' : 'max-w-3xl'}`}>
      <AppHeader />
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="gold-heading text-2xl">{title}</h2>
          {subtitle && <p className="font-manuscript italic text-gold-bright opacity-80 text-sm">{subtitle}</p>}
        </div>
        <Link to="/dashboard" className="text-sm underline" style={{ color: 'var(--gold)' }}>
          ← டாஷ்போர்டு
        </Link>
      </div>
      {children}
      <p className="text-center text-xs opacity-60 py-6" style={{ color: 'var(--gold)' }}>
        © 2026 Vinayagamoorthy Jothidam. All Rights Reserved. TVP Creations
      </p>
    </div>
  );
}
