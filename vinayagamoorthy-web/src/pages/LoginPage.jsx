import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { login } from '../api/client';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await login({ username, password });
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_id', data.user_id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout subtitle="Vedic Astrology Software">
      <h2 className="parchment-heading text-xl mb-4 text-center">உள்நுழைவு</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="field-label">பயனர் பெயர் (Username)</label>
          <input
            className="input-manuscript"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <label className="field-label">கடவுச்சொல் (Password)</label>
          <input
            className="input-manuscript"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn-gold w-full" disabled={loading}>
          {loading ? 'சிறிது காத்திருக்கவும்...' : 'உள்நுழையவும்'}
        </button>
      </form>

      <div className="flex justify-between mt-4 text-sm">
        <Link to="/forgot-password" className="underline" style={{ color: 'var(--ink-brown)' }}>
          கடவுச்சொல் மறந்துவிட்டீர்களா?
        </Link>
        <Link to="/signup" className="underline font-semibold" style={{ color: 'var(--ink-brown)' }}>
          புதிய கணக்கு
        </Link>
      </div>
    </AuthLayout>
  );
}
