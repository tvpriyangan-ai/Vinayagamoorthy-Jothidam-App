import { useEffect, useState } from 'react';
import FeaturePageShell from '../components/FeaturePageShell';
import ParchmentCard from '../components/ParchmentCard';
import { getMyJathagam } from '../api/client';

// South Indian style chart: rasi boxes are FIXED to positions (unlike North
// Indian charts where houses rotate with the ascendant). This is the
// standard 4x4 layout with an empty center.
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
  const [chart, setChart] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyJathagam()
      .then((res) => setChart(res.data))
      .catch(() => setError('ஜாதகத்தை ஏற்ற முடியவில்லை.'));
  }, []);

  if (error) {
    return (
      <FeaturePageShell title="Full Jathagam">
        <ParchmentCard><p className="error-text text-center">{error}</p></ParchmentCard>
      </FeaturePageShell>
    );
  }

  if (!chart) {
    return (
      <FeaturePageShell title="Full Jathagam">
        <ParchmentCard><p className="text-center opacity-70">ஏற்றுகிறது...</p></ParchmentCard>
      </FeaturePageShell>
    );
  }

  const lagnaRasiIndex = chart.ascendant.rasi_index;

  // Group planets by which rasi they occupy
  const planetsByRasi = {};
  Object.entries(chart.planets).forEach(([name, info]) => {
    if (!planetsByRasi[info.rasi_index]) planetsByRasi[info.rasi_index] = [];
    planetsByRasi[info.rasi_index].push(name);
  });

  return (
    <FeaturePageShell title="Full Jathagam" subtitle={`${chart.rasi} ராசி · ${chart.nakshatra} நட்சத்திரம்`} wide>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* South Indian chart */}
        <ParchmentCard>
          <h3 className="parchment-heading text-lg mb-3 text-center">ராசி சக்கரம்</h3>
          <div className="grid grid-cols-4 gap-1 aspect-square max-w-sm mx-auto">
            {CHART_GRID.flat().map((rasiIdx, i) => {
              if (rasiIdx === null) {
                // Center 2x2 — render only once as a spanning info box
                if (i === 5) {
                  return (
                    <div key={i} className="col-span-2 row-span-2 flex items-center justify-center text-center p-2"
                         style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
                      <div>
                        <p className="text-xs opacity-70">லக்னம்</p>
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
                    borderColor: 'rgba(107,78,46,0.5)',
                    background: isLagna ? 'rgba(216,180,92,0.35)' : 'rgba(255,255,255,0.15)',
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
          <p className="text-xs text-center opacity-70 mt-3">
            ல = லக்னம் (Ascendant) &nbsp;|&nbsp; தென்னிந்திய பாணி ராசி சக்கரம்
          </p>
        </ParchmentCard>

        {/* Planet details table */}
        <ParchmentCard>
          <h3 className="parchment-heading text-lg mb-3 text-center">கிரக நிலைகள்</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'rgba(107,78,46,0.4)' }}>
                  <th className="text-left py-1">கிரகம்</th>
                  <th className="text-left py-1">ராசி</th>
                  <th className="text-left py-1">நட்சத்திரம்</th>
                  <th className="text-center py-1">வக்ரம்</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(chart.planets).map(([name, info]) => (
                  <tr key={name} className="border-b" style={{ borderColor: 'rgba(107,78,46,0.15)' }}>
                    <td className="py-1.5 font-medium">{PLANET_SHORT_TA[name]} {name}</td>
                    <td className="py-1.5">{info.rasi_name_ta} ({info.degree_in_rasi}°)</td>
                    <td className="py-1.5">{info.nakshatra_name_ta}</td>
                    <td className="text-center py-1.5">{info.retrograde ? '✓' : '—'}</td>
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
