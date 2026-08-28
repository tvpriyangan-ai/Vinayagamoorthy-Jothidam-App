import { useEffect, useState } from 'react';
import FeaturePageShell from '../components/FeaturePageShell';
import ParchmentCard from '../components/ParchmentCard';
import Loading from '../components/Loading';
import { useT } from '../i18n/LanguageContext';
import { getMyTransitPredictions } from '../api/client';

export default function TransitPage() {
  const t = useT();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyTransitPredictions()
      .then((res) => setData(res.data))
      .catch(() => setError(t('transit.loadError')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) return <FeaturePageShell title={t('transit.title')}><ParchmentCard><p className="error-text text-center">{error}</p></ParchmentCard></FeaturePageShell>;
  if (!data) return <FeaturePageShell title={t('transit.title')}><ParchmentCard><Loading text={t('common.loading')} /></ParchmentCard></FeaturePageShell>;

  const dur = (d) => [
    d.years ? `${d.years} ${t('transit.yrs')}` : null,
    d.months ? `${d.months} ${t('transit.mos')}` : null,
  ].filter(Boolean).join(' ') || `0 ${t('transit.mos')}`;

  return (
    <FeaturePageShell
      title={t('transit.title')}
      subtitle={`${data.date} · ${t('field.rasi')}: ${data.natal_moon_rasi}`}
      wide
    >
      {/* ---- Vimshottari Dasha ("dhasa") / Bhukti ("puththi") ---- */}
      {data.dasha && (
        <ParchmentCard className="mb-4">
          <h3 className="parchment-heading text-lg mb-3 text-center">{t('transit.dashaTitle')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <DashaBox
              label={t('transit.mahaDasha')}
              lord={`${data.dasha.current_maha_dasha.lord_ta} (${data.dasha.current_maha_dasha.lord})`}
              range={`${data.dasha.current_maha_dasha.start} → ${data.dasha.current_maha_dasha.end}`}
              remaining={`${t('transit.remaining')}: ${dur(data.dasha.current_maha_dasha.remaining)}`}
            />
            <DashaBox
              label={t('transit.bhukti')}
              lord={`${data.dasha.current_bhukti.lord_ta} (${data.dasha.current_bhukti.lord})`}
              range={`${data.dasha.current_bhukti.start} → ${data.dasha.current_bhukti.end}`}
              remaining={`${t('transit.remaining')}: ${dur(data.dasha.current_bhukti.remaining)}`}
            />
          </div>

          <details>
            <summary className="text-sm cursor-pointer opacity-80">{t('transit.timeline')}</summary>
            <table className="manuscript-table mt-2">
              <tbody>
                {data.dasha.maha_dasha_timeline.map((m, i) => {
                  const isCurrent = m.start === data.dasha.current_maha_dasha.start;
                  return (
                    <tr key={i} style={{ background: isCurrent ? 'rgba(201,164,92,0.3)' : 'transparent' }}>
                      <td className="font-medium">{m.lord_ta} ({m.lord})</td>
                      <td className="opacity-75">{m.start} → {m.end}</td>
                      <td className="text-right opacity-60">{m.years} {t('transit.yrs')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </details>

          <p className="text-xs font-manuscript italic text-center opacity-70 mt-3">{data.dasha.note}</p>
        </ParchmentCard>
      )}

      {/* ---- Gochara (transit) cards ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.transits.map((tr) => (
          <ParchmentCard key={tr.planet}>
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold">{tr.planet_name_ta} ({tr.planet})</h3>
              <span className={`badge ${tr.favorable ? 'badge-advantage' : 'badge-attention'}`}>
                {tr.favorable ? 'சாதகம்' : 'கவனம் தேவை'}
              </span>
            </div>
            <p className="text-sm opacity-80">{tr.current_rasi}</p>
            <p className="text-sm opacity-80">{tr.house_from_moon} {t('transit.of')} 12</p>
            {tr.retrograde && <p className="text-xs mt-1 opacity-60">(வக்ர கதியில் உள்ளது)</p>}
          </ParchmentCard>
        ))}
      </div>

      <ParchmentCard className="mt-4">
        <p className="text-sm font-manuscript italic text-center opacity-80">{data.note}</p>
      </ParchmentCard>
    </FeaturePageShell>
  );
}

function DashaBox({ label, lord, range, remaining }) {
  return (
    <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(40,24,10,0.3)' }}>
      <p className="text-xs opacity-70">{label}</p>
      <p className="font-semibold text-lg">{lord}</p>
      <p className="text-xs opacity-75 mt-1">{range}</p>
      <p className="text-sm font-medium mt-1" style={{ color: 'var(--alert-red)' }}>{remaining}</p>
    </div>
  );
}
