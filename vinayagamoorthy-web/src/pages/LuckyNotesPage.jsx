import { useEffect, useState } from 'react';
import FeaturePageShell from '../components/FeaturePageShell';
import ParchmentCard from '../components/ParchmentCard';
import { getMyLuckyNotes } from '../api/client';

export default function LuckyNotesPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyLuckyNotes()
      .then((res) => setData(res.data))
      .catch(() => setError('அதிர்ஷ்ட குறிப்புகளை ஏற்ற முடியவில்லை.'));
  }, []);

  if (error) return <FeaturePageShell title="Lucky Notes"><ParchmentCard><p className="error-text text-center">{error}</p></ParchmentCard></FeaturePageShell>;
  if (!data) return <FeaturePageShell title="Lucky Notes"><ParchmentCard><p className="text-center opacity-70">ஏற்றுகிறது...</p></ParchmentCard></FeaturePageShell>;

  return (
    <FeaturePageShell title="Lucky Notes" subtitle={`${data.rasi} ராசிக்கான குறிப்புகள்`} wide>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ParchmentCard>
          <h3 className="parchment-heading text-lg mb-3 text-center">அனுகூலமான குறிப்புகள்</h3>
          <div className="space-y-2 text-sm">
            <NoteRow label="ஆளும் கிரகம்" value={data.favorable.ruling_planet} />
            <NoteRow label="அதிர்ஷ்ட நிறம்" value={data.favorable.lucky_color} />
            <NoteRow label="அதிர்ஷ்ட எண்" value={data.favorable.lucky_number} />
            <NoteRow label="அதிர்ஷ்ட நாள்" value={data.favorable.lucky_day} />
            <NoteRow label="அதிர்ஷ்ட கல்" value={data.favorable.lucky_stone} />
            <NoteRow label="அதிர்ஷ்ட உலோகம்" value={data.favorable.lucky_metal} />
            <NoteRow label="நட்பு ராசிகள்" value={data.favorable.friendly_rasis.join(', ')} />
          </div>
        </ParchmentCard>

        <ParchmentCard>
          <h3 className="parchment-heading text-lg mb-3 text-center" style={{ color: 'var(--alert-red)' }}>
            கவனிக்க வேண்டியவை
          </h3>
          <div className="space-y-2 text-sm">
            <NoteRow label="சவாலான ராசிகள்" value={data.unfavorable.challenging_rasis.join(', ') || 'இல்லை'} />
            <NoteRow label="சவாலான கிரகங்கள்" value={data.unfavorable.challenging_planets.join(', ') || 'இல்லை'} />
          </div>
          <p className="text-xs font-manuscript italic opacity-70 mt-4 text-center">
            இவை பொது வழிகாட்டுதல்கள் — உங்கள் முழு ஜாதகத்தை பொறுத்து மாறுபடலாம்.
          </p>
        </ParchmentCard>
      </div>
    </FeaturePageShell>
  );
}

function NoteRow({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-1" style={{ borderColor: 'rgba(107,78,46,0.15)' }}>
      <span className="opacity-70">{label}</span>
      <span className="font-semibold text-right">{value}</span>
    </div>
  );
}
