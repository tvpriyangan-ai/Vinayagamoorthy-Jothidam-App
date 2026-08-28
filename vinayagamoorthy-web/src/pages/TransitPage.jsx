import { useEffect, useState } from 'react';
import FeaturePageShell from '../components/FeaturePageShell';
import ParchmentCard from '../components/ParchmentCard';
import { getMyTransitPredictions } from '../api/client';

export default function TransitPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyTransitPredictions()
      .then((res) => setData(res.data))
      .catch(() => setError('கிரக நிலைகளை ஏற்ற முடியவில்லை.'));
  }, []);

  if (error) return <FeaturePageShell title="Transit Predictions"><ParchmentCard><p className="error-text text-center">{error}</p></ParchmentCard></FeaturePageShell>;
  if (!data) return <FeaturePageShell title="Transit Predictions"><ParchmentCard><p className="text-center opacity-70">ஏற்றுகிறது...</p></ParchmentCard></FeaturePageShell>;

  return (
    <FeaturePageShell
      title="Transit Predictions"
      subtitle={`${data.date} · உங்கள் ராசி: ${data.natal_moon_rasi}`}
      wide
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.transits.map((t) => (
          <ParchmentCard key={t.planet}>
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold">{t.planet_name_ta} ({t.planet})</h3>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: t.favorable ? 'rgba(60,120,60,0.15)' : 'rgba(122,35,24,0.12)',
                  color: t.favorable ? '#2d5a2d' : 'var(--alert-red)',
                }}
              >
                {t.favorable ? 'சாதகம்' : 'கவனம் தேவை'}
              </span>
            </div>
            <p className="text-sm opacity-80">தற்போதைய ராசி: {t.current_rasi}</p>
            <p className="text-sm opacity-80">உங்கள் ராசியிலிருந்து {t.house_from_moon}ம் வீடு</p>
            {t.retrograde && <p className="text-xs mt-1 opacity-60">(வக்ர கதியில் உள்ளது)</p>}
          </ParchmentCard>
        ))}
      </div>

      <ParchmentCard className="mt-4">
        <p className="text-sm font-manuscript italic text-center opacity-80">{data.note}</p>
      </ParchmentCard>
    </FeaturePageShell>
  );
}
