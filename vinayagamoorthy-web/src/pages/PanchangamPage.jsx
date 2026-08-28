import { useEffect, useState } from 'react';
import FeaturePageShell from '../components/FeaturePageShell';
import ParchmentCard from '../components/ParchmentCard';
import { getTodayPanchangam } from '../api/client';

export default function PanchangamPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getTodayPanchangam()
      .then((res) => setData(res.data))
      .catch(() => setError('பஞ்சாங்கத்தை ஏற்ற முடியவில்லை.'));
  }, []);

  return (
    <FeaturePageShell title="Panchangam" subtitle={data ? `${data.date} · ${data.vaaram}` : ''}>
      {error && <ParchmentCard><p className="error-text text-center">{error}</p></ParchmentCard>}
      {!data && !error && <ParchmentCard><p className="text-center opacity-70">ஏற்றுகிறது...</p></ParchmentCard>}
      {data && (
        <div className="space-y-4">
          <ParchmentCard>
            <h3 className="parchment-heading text-lg mb-3 text-center">பஞ்சாங்க விவரங்கள்</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <InfoRow label="வாரம்" value={data.vaaram} />
              <InfoRow label="சூரிய உதயம்" value={data.sunrise} />
              <InfoRow label="சூரிய அஸ்தமனம்" value={data.sunset} />
              <InfoRow label="திதி" value={`${data.tithi.name_ta} (${data.tithi.number})`} />
              <InfoRow label="பக்ஷம்" value={data.tithi.paksha} />
              <InfoRow label="நட்சத்திரம்" value={`${data.nakshatra.name_ta}, பாதம் ${data.nakshatra.pada}`} />
              <InfoRow label="யோகம்" value={data.yoga.name_ta} />
              <InfoRow label="கரணம்" value={data.karana.name_ta} />
            </div>
          </ParchmentCard>

          <ParchmentCard>
            <h3 className="parchment-heading text-lg mb-3 text-center">அசுப காலங்கள்</h3>
            <p className="text-xs text-center opacity-70 mb-3 font-manuscript italic">
              இந்த நேரங்களில் புதிய முக்கிய காரியங்களைத் தொடங்குவதைத் தவிர்க்கவும்
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-sm">
              <TimeBlock label="ராகு காலம்" start={data.rahu_kalam.start} end={data.rahu_kalam.end} />
              <TimeBlock label="எமகண்டம்" start={data.yamagandam.start} end={data.yamagandam.end} />
              <TimeBlock label="குளிகை காலம்" start={data.gulikai_kalam.start} end={data.gulikai_kalam.end} />
            </div>
          </ParchmentCard>
        </div>
      )}
    </FeaturePageShell>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-1" style={{ borderColor: 'rgba(107,78,46,0.15)' }}>
      <span className="opacity-70">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function TimeBlock({ label, start, end }) {
  return (
    <div className="rounded-lg p-3" style={{ background: 'rgba(122,35,24,0.12)', border: '1px solid rgba(122,35,24,0.3)' }}>
      <p className="text-xs opacity-70 mb-1">{label}</p>
      <p className="font-semibold">{start} - {end}</p>
    </div>
  );
}
