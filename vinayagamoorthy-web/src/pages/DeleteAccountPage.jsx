import { useState } from 'react';
import { Link } from 'react-router-dom';
import ParchmentCard from '../components/ParchmentCard';
import ConfirmModal from '../components/ConfirmModal';
import SiteFooter from '../components/SiteFooter';
import { login, deleteMyAccount, extractErrorMessage } from '../api/client';

// Public page — no login required to VIEW it. Referenced from Google Play
// Console's "Data safety" / account-deletion URL requirement, and linked
// from the site footer. It both explains the in-app deletion path and lets
// someone delete their account right here, without installing the app.
//
// 'form' -> enter username/password  'confirm' -> are-you-sure popup  'done' -> success
export default function DeleteAccountPage() {
  const [step, setStep] = useState('form');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleVerify(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Verifies the credentials belong to a real account and gets a token
      // scoped to that account only — the delete step below can only ever
      // act on this same account.
      const { data } = await login({ username, password });
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_id', data.user_id);
      setStep('confirm');
    } catch (err) {
      setError(extractErrorMessage(err, 'உள்நுழைவு தோல்வியடைந்தது. பயனர் பெயர்/கடவுச்சொல்லைச் சரிபார்க்கவும்.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmDelete() {
    setLoading(true);
    setError('');
    try {
      await deleteMyAccount();
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      setStep('done');
    } catch (err) {
      setError(extractErrorMessage(err, 'கணக்கை நீக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'));
      setLoading(false);
    }
  }

  function handleCancel() {
    // Drop the token we obtained just to verify the login — don't leave the
    // browser signed in as a side effect of visiting this page.
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    setPassword('');
    setStep('form');
  }

  return (
    <div className="app-shell flex items-center justify-center px-4 py-10">
      <div className="relative z-10 w-full max-w-lg">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="Vinayagamoorthy Jothidam"
            className="w-20 h-20 rounded-full border-2 border-gold shadow-lg mb-3"
          />
          <h1 className="brand-wordmark text-2xl text-center">VINAYAGAMOORTHY</h1>
          <p className="gold-heading text-xs tracking-[0.3em] mt-1">JOTHIDAM</p>
        </div>

        <ParchmentCard>
          <h2 className="parchment-heading text-xl text-center mb-4">Delete Your Account</h2>

          <div className="text-sm space-y-3 mb-5">
            <p>
              Deleting your Vinayagamoorthy Jothidam account permanently removes your profile,
              birth chart, jathagam reading, matching/compatibility checks, chat history, personal
              Vastu report, and uploaded palm photo from our database. This cannot be undone.
            </p>
            <p className="opacity-80">
              <strong>In the app:</strong> log in → open <em>Profile</em> → tap{' '}
              <em>Delete Account</em> → confirm.
            </p>
            <p className="opacity-80">
              <strong>Without the app:</strong> use the form below — no install required.
            </p>
          </div>

          <hr className="manuscript-rule my-4" />

          {step === 'done' ? (
            <p className="text-center text-sm" style={{ color: 'var(--success-green)' }}>
              Your account has been successfully deleted.
              <br />
              உங்கள் கணக்கு வெற்றிகரமாக நீக்கப்பட்டது.
            </p>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="field-label">Username</label>
                <input
                  className="input-manuscript"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={step === 'confirm'}
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="field-label">Password</label>
                <input
                  className="input-manuscript"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={step === 'confirm'}
                  required
                />
              </div>
              {error && step === 'form' && <p className="error-text">{error}</p>}
              <button type="submit" className="btn-danger w-full" disabled={loading || step === 'confirm'}>
                {loading && step === 'form' ? 'சரிபார்க்கிறது...' : 'Delete My Account'}
              </button>
            </form>
          )}
        </ParchmentCard>

        <div className="text-center mt-5">
          <Link to="/login" className="text-xs underline" style={{ color: 'var(--gold)' }}>
            ← Back to Login
          </Link>
        </div>

        <SiteFooter className="!py-3" />
      </div>

      {step === 'confirm' && (
        <ConfirmModal
          title="Delete your account?"
          confirmLabel={loading ? 'Deleting...' : 'Yes, delete my account'}
          cancelLabel="Cancel"
          loading={loading}
          error={error}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancel}
        >
          This is permanent — all data for <strong>{username}</strong> will be deleted immediately.
        </ConfirmModal>
      )}
    </div>
  );
}
