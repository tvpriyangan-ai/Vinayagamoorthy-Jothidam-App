import { useEffect, useState, useRef } from 'react';
import FeaturePageShell from '../components/FeaturePageShell';
import ParchmentCard from '../components/ParchmentCard';
import { getMyProfile, updateMyProfile, uploadPalmPhoto, extractErrorMessage } from '../api/client';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', mobile: '', preferred_language: 'ta' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [photoError, setPhotoError] = useState('');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        setProfile(res.data);
        setForm({
          name: res.data.name,
          email: res.data.email || '',
          mobile: res.data.mobile || '',
          preferred_language: res.data.preferred_language,
        });
      })
      .catch(() => setError('சுயவிவரத்தை ஏற்ற முடியவில்லை.'));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handlePhotoSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError('');
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setPhotoError('JPEG, PNG, அல்லது WEBP படங்கள் மட்டுமே அனுமதிக்கப்படும்.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('படம் 5MB க்கும் குறைவாக இருக்க வேண்டும்.');
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    handlePhotoUpload(file);
  }

  async function handlePhotoUpload(file) {
    setPhotoUploading(true);
    setPhotoError('');
    try {
      const { data } = await uploadPalmPhoto(file);
      setProfile((p) => ({ ...p, palm_photo_url: data.palm_photo_url }));
    } catch (err) {
      setPhotoError(extractErrorMessage(err, 'படத்தை பதிவேற்ற முடியவில்லை.'));
    } finally {
      setPhotoUploading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      // Only send fields that have real values — an empty string for email
      // fails EmailStr validation (empty string isn't the same as "not provided").
      const payload = {
        name: form.name || undefined,
        email: form.email.trim() || undefined,
        mobile: form.mobile.trim() || undefined,
        preferred_language: form.preferred_language || undefined,
      };
      const { data } = await updateMyProfile(payload);
      setProfile(data);
      setSuccess('சுயவிவரம் புதுப்பிக்கப்பட்டது!');
    } catch (err) {
      setError(extractErrorMessage(err, 'புதுப்பிக்க முடியவில்லை.'));
    } finally {
      setSaving(false);
    }
  }


  if (!profile) {
    return (
      <FeaturePageShell title="View / Edit Profile">
        <ParchmentCard><p className="text-center opacity-70">{error || 'ஏற்றுகிறது...'}</p></ParchmentCard>
      </FeaturePageShell>
    );
  }

  return (
    <FeaturePageShell title="View / Edit Profile">
      <ParchmentCard className="mb-4">
        <h3 className="parchment-heading text-lg mb-3 text-center">உள்ளங்கை புகைப்படம்</h3>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-28 h-28 rounded-full border-2 flex items-center justify-center overflow-hidden bg-white/20"
            style={{ borderColor: 'var(--gold)' }}
          >
            {previewUrl || profile.palm_photo_url ? (
              <img
                src={previewUrl || profile.palm_photo_url}
                alt="Palm"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">🤚</span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoSelect}
            className="hidden"
          />
          <button
            type="button"
            className="btn-gold !py-1.5 !px-4 text-sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={photoUploading}
          >
            {photoUploading ? 'பதிவேற்றுகிறது...' : profile.palm_photo_url ? 'புகைப்படத்தை மாற்றவும்' : 'புகைப்படம் சேர்க்கவும்'}
          </button>
          {photoError && <p className="error-text text-center">{photoError}</p>}
          <p className="text-xs opacity-70 text-center font-manuscript italic">
            JPEG, PNG, அல்லது WEBP · அதிகபட்சம் 5MB
          </p>
        </div>
      </ParchmentCard>

      <ParchmentCard className="mb-4">
        <h3 className="parchment-heading text-lg mb-3 text-center">பிறப்பு விவரங்கள் (மாற்ற முடியாது)</h3>
        <p className="text-xs text-center opacity-70 mb-3 font-manuscript italic">
          பிறப்பு விவரங்களை மாற்ற வேண்டுமா? இது உங்கள் முழு ஜாதகத்தையும் பாதிக்கும் —
          தயவுசெய்து ஆதரவைத் தொடர்பு கொள்ளவும்.
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <span className="opacity-70">தேதி:</span><span className="font-semibold">{profile.birth.date}</span>
          <span className="opacity-70">நேரம்:</span><span className="font-semibold">{profile.birth.time}</span>
          <span className="opacity-70">இடம்:</span><span className="font-semibold">{profile.birth.place}</span>
          <span className="opacity-70">பாலினம்:</span><span className="font-semibold">{profile.gender === 'male' ? 'ஆண்' : 'பெண்'}</span>
        </div>
      </ParchmentCard>

      <ParchmentCard>
        <h3 className="parchment-heading text-lg mb-3 text-center">தனிப்பட்ட விவரங்கள்</h3>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="field-label">பெயர்</label>
            <input className="input-manuscript" value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </div>
          <div>
            <label className="field-label">மின்னஞ்சல்</label>
            <input className="input-manuscript" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div>
            <label className="field-label">மொபைல்</label>
            <input className="input-manuscript" value={form.mobile} onChange={(e) => update('mobile', e.target.value)} />
          </div>
          <div>
            <label className="field-label">விருப்ப மொழி</label>
            <select className="input-manuscript" value={form.preferred_language}
                    onChange={(e) => update('preferred_language', e.target.value)}>
              <option value="ta">தமிழ்</option>
              <option value="en">English</option>
            </select>
          </div>
          {error && <p className="error-text">{error}</p>}
          {success && <p className="text-sm" style={{ color: '#2d5a2d' }}>{success}</p>}
          <button type="submit" className="btn-gold w-full" disabled={saving}>
            {saving ? 'சேமிக்கிறது...' : 'சேமிக்கவும்'}
          </button>
        </form>
      </ParchmentCard>
    </FeaturePageShell>
  );
}
