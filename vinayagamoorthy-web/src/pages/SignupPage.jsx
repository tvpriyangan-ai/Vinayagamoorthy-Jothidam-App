import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { signup } from '../api/client';
import { COMMON_PLACES } from '../data/places';

const initialForm = {
  name: '', username: '', password: '', gender: 'male',
  email: '', mobile: '', preferred_language: 'ta',
  birth_date: '', birth_time: '',
  place_label: COMMON_PLACES[0].label,
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const place = COMMON_PLACES.find((p) => p.label === form.place_label);
    if (!place) {
      setError('பிறந்த இடத்தை தேர்ந்தெடுக்கவும்.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        username: form.username,
        password: form.password,
        gender: form.gender,
        email: form.email || undefined,
        mobile: form.mobile || undefined,
        preferred_language: form.preferred_language,
        birth: {
          date: form.birth_date,
          time: form.birth_time,
          place: place.label,
          latitude: place.lat,
          longitude: place.lon,
          timezone_offset: place.tz,
        },
      };
      const { data } = await signup(payload);
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_id', data.user_id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout subtitle="புதிய கணக்கு உருவாக்கவும்">
      <h2 className="parchment-heading text-xl mb-4 text-center">பதிவு செய்யவும்</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="field-label">பெயர் (Name)</label>
          <input className="input-manuscript" value={form.name}
                 onChange={(e) => update('name', e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">பயனர் பெயர்</label>
            <input className="input-manuscript" value={form.username}
                   onChange={(e) => update('username', e.target.value)} required />
          </div>
          <div>
            <label className="field-label">கடவுச்சொல்</label>
            <input className="input-manuscript" type="password" value={form.password}
                   onChange={(e) => update('password', e.target.value)} required minLength={6} />
          </div>
        </div>

        <div>
          <label className="field-label">பாலினம் (Gender)</label>
          <div className="flex gap-4 font-tamil text-sm">
            <label className="flex items-center gap-1">
              <input type="radio" name="gender" checked={form.gender === 'male'}
                     onChange={() => update('gender', 'male')} /> ஆண்
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" name="gender" checked={form.gender === 'female'}
                     onChange={() => update('gender', 'female')} /> பெண்
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">மின்னஞ்சல் (Email)</label>
            <input className="input-manuscript" type="email" value={form.email}
                   onChange={(e) => update('email', e.target.value)} />
          </div>
          <div>
            <label className="field-label">மொபைல் (Mobile)</label>
            <input className="input-manuscript" value={form.mobile}
                   onChange={(e) => update('mobile', e.target.value)} />
          </div>
        </div>

        <div className="rope-divider" style={{ margin: '0.75rem 0' }} />

        <p className="field-label !mb-1">பிறப்பு விவரங்கள் (Birth Details)</p>
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
          <label className="field-label">பிறந்த இடம் (Place)</label>
          <select className="input-manuscript" value={form.place_label}
                  onChange={(e) => update('place_label', e.target.value)}>
            {COMMON_PLACES.map((p) => (
              <option key={p.label} value={p.label}>{p.label}</option>
            ))}
          </select>
          <p className="text-xs mt-1 opacity-70 font-manuscript italic">
            உங்கள் ஊர் இல்லையெனில் நெருக்கமான பெரிய நகரத்தைத் தேர்ந்தெடுக்கவும்.
          </p>
        </div>

        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn-gold w-full" disabled={loading}>
          {loading ? 'உருவாக்கப்படுகிறது...' : 'கணக்கு உருவாக்கவும்'}
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        ஏற்கனவே கணக்கு உள்ளதா?{' '}
        <Link to="/login" className="underline font-semibold" style={{ color: 'var(--ink-brown)' }}>
          உள்நுழையவும்
        </Link>
      </p>
    </AuthLayout>
  );
}
