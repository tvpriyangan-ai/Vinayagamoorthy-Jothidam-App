import { useState, useRef } from 'react';
import FeaturePageShell from '../components/FeaturePageShell';
import ParchmentCard from '../components/ParchmentCard';
import RopeDivider from '../components/RopeDivider';
import MatchingReportCard from '../components/MatchingReportCard';
import { checkMatching, extractErrorMessage } from '../api/client';
import { COMMON_PLACES } from '../data/places';
import html2canvas from 'html2canvas';

export default function MatchingPage() {
  const [form, setForm] = useState({
    name: '', gender: 'female',
    birth_date: '', birth_time: '',
    place_label: COMMON_PLACES[0].label,
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = `${form.name || 'matching'}-porutham-report.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch (err) {
      setError('படத்தை உருவாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setDownloading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    const place = COMMON_PLACES.find((p) => p.label === form.place_label);
    setLoading(true);
    try {
      const { data } = await checkMatching({
        name: form.name,
        gender: form.gender,
        birth: {
          date: form.birth_date, time: form.birth_time, place: place.label,
          latitude: place.lat, longitude: place.lon, timezone_offset: place.tz,
        },
      });
      setResult(data);
    } catch (err) {
      setError(extractErrorMessage(err, 'பொருத்தத்தை கணக்கிட முடியவில்லை.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <FeaturePageShell title="Matching & Advices" subtitle="22 பொருத்தம் முழு அறிக்கை" wide>
      <ParchmentCard className="mb-4">
        <h3 className="parchment-heading text-lg mb-3 text-center">துணையின் விவரங்கள்</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="field-label">பெயர்</label>
            <input className="input-manuscript" value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </div>
          <div>
            <label className="field-label">பாலினம்</label>
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-1">
                <input type="radio" checked={form.gender === 'male'} onChange={() => update('gender', 'male')} /> ஆண்
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" checked={form.gender === 'female'} onChange={() => update('gender', 'female')} /> பெண்
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">பிறந்த தேதி</label>
              <input className="input-manuscript" type="date" value={form.birth_date}
                     onChange={(e) => update('birth_date', e.target.value)} required />
            </div>
            <div>
              <label className="field-label">பிறந்த நேரம்</label>
              <input className="input-manuscript" type="time" value={form.birth_time}
                     onChange={(e) => update('birth_time', e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="field-label">பிறந்த இடம்</label>
            <select className="input-manuscript" value={form.place_label} onChange={(e) => update('place_label', e.target.value)}>
              {COMMON_PLACES.map((p) => <option key={p.label} value={p.label}>{p.label}</option>)}
            </select>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn-gold w-full" disabled={loading}>
            {loading ? 'கணக்கிடுகிறது...' : 'பொருத்தம் பார்க்கவும்'}
          </button>
        </form>
      </ParchmentCard>

      {result && (
        <>
          <RopeDivider knots={2} />
          {result.critical_failures.length > 0 && (
            <p className="text-center text-sm mb-3 font-semibold" style={{ color: 'var(--alert-red)' }}>
              கவனம்: {result.critical_failures.join(', ')} பொருந்தவில்லை
            </p>
          )}

          <div className="flex justify-center overflow-x-auto py-4">
            <MatchingReportCard ref={cardRef} result={result} />
          </div>

          <button onClick={handleDownload} className="btn-gold w-full" disabled={downloading}>
            {downloading ? 'படம் தயாராகிறது...' : '⬇ அறிக்கையை படமாக பதிவிறக்கவும்'}
          </button>
        </>
      )}
    </FeaturePageShell>
  );
}
