import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import FeatureScreenShell from '../components/FeatureScreenShell';
import ParchmentCard from '../components/ParchmentCard';
import FormField from '../components/FormField';
import GoldButton from '../components/GoldButton';
import { getMyProfile, updateMyProfile, extractErrorMessage } from '../api/client';
import { colors, fonts } from '../theme/theme';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyProfile().then((res) => {
      setProfile(res.data);
      setName(res.data.name);
      setEmail(res.data.email || '');
      setMobile(res.data.mobile || '');
    }).catch(() => setError('சுயவிவரத்தை ஏற்ற முடியவில்லை.'));
  }, []);

  async function handleSave() {
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      // Only send non-empty values — an empty string fails EmailStr validation.
      const payload = {
        name: name || undefined,
        email: email.trim() || undefined,
        mobile: mobile.trim() || undefined,
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
      <FeatureScreenShell title="View / Edit Profile" navigation={navigation}>
        {error ? <Text style={styles.error}>{error}</Text> : <ActivityIndicator color={colors.gold} />}
      </FeatureScreenShell>
    );
  }

  return (
    <FeatureScreenShell title="View / Edit Profile" navigation={navigation}>
      <ParchmentCard style={{ marginBottom: 14 }}>
        <Text style={styles.cardTitle}>பிறப்பு விவரங்கள் (மாற்ற முடியாது)</Text>
        <Text style={styles.hint}>பிறப்பு விவரங்களை மாற்ற வேண்டுமா? இது உங்கள் முழு ஜாதகத்தையும் பாதிக்கும் — ஆதரவைத் தொடர்பு கொள்ளவும்.</Text>
        <Row label="தேதி" value={profile.birth.date} />
        <Row label="நேரம்" value={profile.birth.time} />
        <Row label="இடம்" value={profile.birth.place} />
        <Row label="பாலினம்" value={profile.gender === 'male' ? 'ஆண்' : 'பெண்'} />
      </ParchmentCard>

      <ParchmentCard>
        <Text style={styles.cardTitle}>தனிப்பட்ட விவரங்கள்</Text>
        <FormField label="பெயர்" value={name} onChangeText={setName} />
        <FormField label="மின்னஞ்சல்" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <FormField label="மொபைல்" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
        {!!error && <Text style={styles.error}>{error}</Text>}
        {!!success && <Text style={styles.success}>{success}</Text>}
        <GoldButton title={saving ? 'சேமிக்கிறது...' : 'சேமிக்கவும்'} onPress={handleSave} loading={saving} />
      </ParchmentCard>
    </FeatureScreenShell>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}:</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardTitle: { fontFamily: fonts.headingMedium, color: colors.parchmentHeading, fontSize: 15, textAlign: 'center', marginBottom: 8 },
  hint: { fontFamily: fonts.manuscript, color: colors.inkBrown, fontSize: 12, textAlign: 'center', opacity: 0.75, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  rowLabel: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 13, opacity: 0.75 },
  rowValue: { fontFamily: fonts.bodySemibold, color: colors.inkBrown, fontSize: 13 },
  error: { fontFamily: fonts.body, color: colors.alertRed, fontSize: 13, marginBottom: 8 },
  success: { fontFamily: fonts.body, color: colors.successGreen, fontSize: 13, marginBottom: 8 },
});
