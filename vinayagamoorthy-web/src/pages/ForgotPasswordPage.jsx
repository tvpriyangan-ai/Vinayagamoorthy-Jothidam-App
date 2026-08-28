import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { forgotPassword, resetPassword, extractErrorMessage } from '../api/client';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState('request'); // 'request' | 'reset'
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRequest(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await forgotPassword({ identifier });
      setMessage(data.message);
      setStep('reset');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword({ identifier, otp, new_password: newPassword });
      setMessage('கடவுச்சொல் மாற்றப்பட்டது! இப்போது உள்நுழையவும்.');
    } catch (err) {
      setError(extractErrorMessage(err, 'OTP தவறானது அல்லது காலாவதியானது.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout subtitle="கடவுச்சொல் மீட்டமைப்பு">
      <h2 className="parchment-heading text-xl mb-4 text-center">கடவுச்சொல் மறந்துவிட்டீர்களா?</h2>

      {step === 'request' ? (
        <form onSubmit={handleRequest} className="space-y-4">
          <div>
            <label className="field-label">மின்னஞ்சல் / மொபைல்</label>
            <input className="input-manuscript" value={identifier}
                   onChange={(e) => setIdentifier(e.target.value)} required />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn-gold w-full" disabled={loading}>
            {loading ? 'அனுப்புகிறது...' : 'OTP அனுப்பவும்'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          {message && <p className="text-sm opacity-80">{message}</p>}
          <div>
            <label className="field-label">OTP</label>
            <input className="input-manuscript" value={otp}
                   onChange={(e) => setOtp(e.target.value)} required />
          </div>
          <div>
            <label className="field-label">புதிய கடவுச்சொல்</label>
            <input className="input-manuscript" type="password" value={newPassword}
                   onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn-gold w-full" disabled={loading}>
            {loading ? 'மாற்றப்படுகிறது...' : 'கடவுச்சொல் மாற்றவும்'}
          </button>
        </form>
      )}

      <p className="text-center text-sm mt-4">
        <Link to="/login" className="underline font-semibold" style={{ color: 'var(--ink-brown)' }}>
          உள்நுழைவுக்குத் திரும்பவும்
        </Link>
      </p>
    </AuthLayout>
  );
}
