import { useEffect, useState } from 'react';
import FeaturePageShell from '../components/FeaturePageShell';
import ParchmentCard from '../components/ParchmentCard';
import { listTemples } from '../api/client';

export default function TemplesPage() {
  const [temples, setTemples] = useState(null);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    listTemples()
      .then((res) => setTemples(res.data))
      .catch(() => setError('கோவில் தகவல்களை ஏற்ற முடியவில்லை.'));
  }, []);

  return (
    <FeaturePageShell title="Temples & Pujas" subtitle="நவகிரக தலங்கள் மற்றும் முக்கிய கோவில்கள்" wide>
      {error && <ParchmentCard><p className="error-text text-center">{error}</p></ParchmentCard>}
      {!temples && !error && <ParchmentCard><p className="text-center opacity-70">ஏற்றுகிறது...</p></ParchmentCard>}
      {temples && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {temples.map((t) => (
            <ParchmentCard key={t.id} className="cursor-pointer" onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{t.name_ta}</h3>
                  <p className="text-xs opacity-70">{t.name_en}</p>
                </div>
                {t.associated_planet && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(216,180,92,0.35)' }}>
                    {t.associated_planet}
                  </span>
                )}
              </div>
              <p className="text-sm mt-1">{t.deity}</p>
              <p className="text-xs opacity-70">{t.place}, {t.state}</p>

              {expanded === t.id && (
                <div className="mt-3 pt-3 border-t text-sm" style={{ borderColor: 'rgba(107,78,46,0.3)' }}>
                  <p className="mb-2">{t.description}</p>
                  {t.visiting_hours && (
                    <p className="text-xs mb-2">🕐 <span className="font-semibold">தரிசன நேரம்:</span> {t.visiting_hours}</p>
                  )}
                  {t.special_note && (
                    <div
                      className="mb-2 p-2 rounded-lg text-xs italic"
                      style={{ background: 'rgba(216,180,92,0.2)', borderLeft: '3px solid var(--gold)' }}
                    >
                      ✨ {t.special_note}
                    </div>
                  )}
                  {t.pujas?.length > 0 && (
                    <div>
                      <p className="font-semibold mb-1">பூஜைகள்:</p>
                      {t.pujas.map((p, i) => (
                        <p key={i} className="text-xs opacity-90">
                          • {p.name}{p.recommended_day ? ` (${p.recommended_day})` : ''} — {p.description}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-center mt-2 opacity-60">
                {expanded === t.id ? '▲ மறை' : '▼ மேலும் காண'}
              </p>
            </ParchmentCard>
          ))}
        </div>
      )}
    </FeaturePageShell>
  );
}
