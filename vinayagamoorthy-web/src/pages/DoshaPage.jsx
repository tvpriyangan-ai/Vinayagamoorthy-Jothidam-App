import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FeaturePageShell from '../components/FeaturePageShell';
import ParchmentCard from '../components/ParchmentCard';
import { getMyDosha, getTemplesForMyDoshas } from '../api/client';

export default function DoshaPage() {
  const [data, setData] = useState(null);
  const [temples, setTemples] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getMyDosha(), getTemplesForMyDoshas()])
      .then(([doshaRes, templesRes]) => {
        setData(doshaRes.data);
        setTemples(templesRes.data);
      })
      .catch(() => setError('தோஷ அறிக்கையை ஏற்ற முடியவில்லை.'));
  }, []);

  if (error) return <FeaturePageShell title="தோஷ பரிகாரங்கள்"><ParchmentCard><p className="error-text text-center">{error}</p></ParchmentCard></FeaturePageShell>;
  if (!data) return <FeaturePageShell title="தோஷ பரிகாரங்கள்"><ParchmentCard><p className="text-center opacity-70">ஏற்றுகிறது...</p></ParchmentCard></FeaturePageShell>;

  return (
    <FeaturePageShell title="தோஷ பரிகாரங்கள்" wide>
      <div className="space-y-4">
        {data.doshas.map((dosha) => (
          <ParchmentCard key={dosha.name}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="parchment-heading text-lg">{dosha.name}</h3>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  background: dosha.present ? 'rgba(122,35,24,0.15)' : 'rgba(60,120,60,0.15)',
                  color: dosha.present ? 'var(--alert-red)' : '#2d5a2d',
                }}
              >
                {dosha.present ? 'உள்ளது' : 'இல்லை'}
              </span>
            </div>
            <p className="text-sm opacity-80 mb-2">{dosha.detail}</p>
            {dosha.phase && <p className="text-sm font-semibold mb-2">கட்டம்: {dosha.phase}</p>}
            {dosha.present && dosha.remedies?.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-semibold mb-1">பரிகாரங்கள்:</p>
                <ul className="text-sm list-disc list-inside space-y-0.5 opacity-90">
                  {dosha.remedies.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
          </ParchmentCard>
        ))}

        <ParchmentCard>
          <p className="text-sm font-manuscript italic text-center opacity-80">{data.note}</p>
        </ParchmentCard>

        {temples?.recommended_temples?.length > 0 && (
          <ParchmentCard>
            <h3 className="parchment-heading text-lg mb-3 text-center">பரிந்துரைக்கப்பட்ட கோவில்கள்</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {temples.recommended_temples.map((t) => (
                <div key={t.id} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.25)' }}>
                  <p className="font-semibold">{t.name_ta}</p>
                  <p className="text-xs opacity-70">{t.place}, {t.state}</p>
                </div>
              ))}
            </div>
            <Link to="/temples" className="btn-gold block text-center mt-4 !py-1.5 text-sm">
              அனைத்து கோவில்களையும் காண்க
            </Link>
          </ParchmentCard>
        )}
      </div>
    </FeaturePageShell>
  );
}
