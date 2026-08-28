import { useEffect, useState, useCallback } from 'react';
import FeaturePageShell from '../components/FeaturePageShell';
import ParchmentCard from '../components/ParchmentCard';
import Loading from '../components/Loading';
import { useLanguage } from '../i18n/LanguageContext';
import { getMyJathagam, getMyJathagamReading } from '../api/client';

// South Indian style chart: rasi boxes are FIXED to positions (unlike North
// Indian charts where houses rotate with the ascendant). Standard 4x4 layout
// with an empty center.
const CHART_GRID = [
  [11, 0, 1, 2],
  [10, null, null, 3],
  [9, null, null, 4],
  [8, 7, 6, 5],
];

const PLANET_SHORT_TA = {
  Sun: 'சூ', Moon: 'சந்', Mars: 'செ', Mercury: 'பு',
  Jupiter: 'கு', Venus: 'சு', Saturn: 'ச', Rahu: 'ரா', Ketu: 'கே',
};

export default function JathagamPage() {
  const { t, language } = useLanguage();
  const [chart, setChart] = useState(null);
  const [error, setError] = useState('');

  const [reading, setReading] = useState(null);   // full response object
  const [readingLoading, setReadingLoading] = useState(true);
  const [openKey, setOpenKey] = useState(null);

  useEffect(() => {
    getMyJathagam()
      .then((res) => setChart(res.data))
      .catch(() => setError(t('jat.chartError')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadReading = useCallback(
    async (refresh = false) => {
      setReadingLoading(true);
      try {
        const { data } = await getMyJathagamReading(language, refresh);
        setReading(data);
        setOpenKey(data?.reading?.sections?.[0]?.key ?? null);
      } catch {
        setReading({ available: false, detail: t('jat.readingUnavailable') });
      } finally {
        setReadingLoading(false);
      }
    },
    [language, t],
  );

  // (Re)fetch the reading whenever the language changes.
  useEffect(() => { loadReading(false); }, [loadReading]);

  if (error) {
    return (
      <FeaturePageShell title={t('jat.title')}>
        <ParchmentCard><p className="error-text text-center">{error}</p></ParchmentCard>
      </FeaturePageShell>
    );
  }

  if (!chart) {
    return (
      <FeaturePageShell title={t('jat.title')}>
        <ParchmentCard><Loading text={t('common.loading')} /></ParchmentCard>
      </FeaturePageShell>
    );
  }

  const lagnaRasiIndex = chart.ascendant.rasi_index;
  const planetsByRasi = {};
  Object.entries(chart.planets).forEach(([name, info]) => {
    if (!planetsByRasi[info.rasi_index]) planetsByRasi[info.rasi_index] = [];
    planetsByRasi[info.rasi_index].push(name);
  });

  return (
    <FeaturePageShell
      title={t('jat.title')}
      subtitle={`${chart.rasi} ${t('field.rasi')} · ${chart.nakshatra} ${t('field.nakshatra')}`}
      wide
    >
      {/* ---- Jothidar-style reading (per the client's sample) ---- */}
      <ReadingSection
        t={t}
        reading={reading}
        loading={readingLoading}
        openKey={openKey}
        setOpenKey={setOpenKey}
        onRegenerate={() => loadReading(true)}
      />

      {/* ---- Chart + planet table ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <ParchmentCard>
          <h3 className="parchment-heading text-lg mb-3 text-center">{t('jat.chakra')}</h3>
          <div className="grid grid-cols-4 gap-1 aspect-square max-w-sm mx-auto">
            {CHART_GRID.flat().map((rasiIdx, i) => {
              if (rasiIdx === null) {
                if (i === 5) {
                  return (
                    <div key={i} className="col-span-2 row-span-2 flex items-center justify-center text-center p-2"
                         style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
                      <div>
                        <p className="text-xs opacity-70">{t('field.lagna')}</p>
                        <p className="font-semibold text-sm">{chart.ascendant.rasi_name_ta}</p>
                      </div>
                    </div>
                  );
                }
                return null;
              }
              const isLagna = rasiIdx === lagnaRasiIndex;
              const planetsHere = planetsByRasi[rasiIdx] || [];
              return (
                <div
                  key={i}
                  className="border p-1 flex flex-col items-center justify-center text-center"
                  style={{
                    borderColor: 'rgba(40,24,10,0.5)',
                    background: isLagna ? 'rgba(201,164,92,0.35)' : 'rgba(255,255,255,0.15)',
                    minHeight: '60px',
                  }}
                >
                  {isLagna && <span className="text-[10px] font-bold" style={{ color: 'var(--alert-red)' }}>ல</span>}
                  <div className="flex flex-wrap gap-0.5 justify-center">
                    {planetsHere.map((p) => (
                      <span key={p} className="text-xs font-semibold">{PLANET_SHORT_TA[p]}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-center opacity-70 mt-3">{t('jat.southIndianNote')}</p>
        </ParchmentCard>

        <ParchmentCard>
          <h3 className="parchment-heading text-lg mb-3 text-center">{t('jat.planetPositions')}</h3>
          <div className="overflow-x-auto">
            <table className="manuscript-table">
              <thead>
                <tr>
                  <th>{t('jat.planet')}</th>
                  <th>{t('field.rasi')}</th>
                  <th>{t('field.nakshatra')}</th>
                  <th className="text-center">{t('jat.retrograde')}</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(chart.planets).map(([name, info]) => (
                  <tr key={name}>
                    <td className="font-medium">{PLANET_SHORT_TA[name]} {name}</td>
                    <td>{info.rasi_name_ta} ({info.degree_in_rasi}°)</td>
                    <td>{info.nakshatra_name_ta}</td>
                    <td className="text-center">{info.retrograde ? '✓' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ParchmentCard>
      </div>
    </FeaturePageShell>
  );
}

function ReadingSection({ t, reading, loading, openKey, setOpenKey, onRegenerate }) {
  if (loading) {
    return (
      <ParchmentCard>
        <h3 className="parchment-heading text-lg mb-2 text-center">{t('jat.readingTitle')}</h3>
        <Loading text={t('jat.readingLoading')} />
      </ParchmentCard>
    );
  }

  if (!reading?.available) {
    return (
      <ParchmentCard>
        <h3 className="parchment-heading text-lg mb-2 text-center">{t('jat.readingTitle')}</h3>
        <p className="text-center opacity-80 text-sm py-3">{t('jat.readingUnavailable')}</p>
        {reading?.detail && (
          <p className="text-center opacity-50 text-xs">{reading.detail}</p>
        )}
        <div className="text-center mt-3">
          <button onClick={onRegenerate} className="btn-gold !py-1.5 !px-4 text-sm">
            {t('jat.readingRegenerate')}
          </button>
        </div>
      </ParchmentCard>
    );
  }

  const r = reading.reading;
  return (
    <ParchmentCard>
      <h3 className="parchment-heading text-xl mb-1 text-center">{r.title || t('jat.readingTitle')}</h3>
      {r.intro && <p className="text-sm text-center opacity-80 mb-4 font-manuscript italic">{r.intro}</p>}

      <div className="space-y-2">
        {r.sections.map((s) => {
          const open = openKey === s.key;
          return (
            <div key={s.key} className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(40,24,10,0.3)' }}>
              <button
                onClick={() => setOpenKey(open ? null : s.key)}
                className="w-full flex items-center justify-between px-3 py-2 text-left font-semibold text-sm"
                style={{ background: 'rgba(255,255,255,0.28)' }}
              >
                <span>{s.heading}</span>
                <span aria-hidden="true">{open ? '−' : '+'}</span>
              </button>
              {open && (
                <p className="px-3 py-3 text-sm leading-relaxed" style={{ background: 'rgba(255,255,255,0.12)' }}>
                  {s.text}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {r.disclaimer && (
        <p className="text-xs opacity-60 mt-4 text-center">{r.disclaimer}</p>
      )}
      <div className="flex items-center justify-between mt-3 gap-2">
        <p className="text-[11px] opacity-45">{t('jat.readingAiNote')}</p>
        <button onClick={onRegenerate} className="btn-gold !py-1 !px-3 text-xs shrink-0">
          {t('jat.readingRegenerate')}
        </button>
      </div>
    </ParchmentCard>
  );
}
