import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppBackground from '../components/AppBackground';
import ParchmentCard from '../components/ParchmentCard';
import FormField from '../components/FormField';
import GoldButton from '../components/GoldButton';
import RopeDivider from '../components/RopeDivider';
import { signup, extractErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { COMMON_PLACES } from '../data/places';
import { colors, fonts } from '../theme/theme';

function formatDate(d) {
  // IMPORTANT: do NOT use d.toISOString() here. That converts to UTC first,
  // which silently shifts the date backward by one day for anyone in a
  // positive-UTC-offset timezone (e.g. India, UTC+5:30) — exactly this
  // app's target audience. Always read the LOCAL calendar fields instead.
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
function formatTime(d) {
  return d.toTimeString().slice(0, 5); // HH:MM
}

export default function SignupScreen({ navigation }) {
  const { signIn } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('male');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [birthDate, setBirthDate] = useState(new Date(1990, 0, 1));
  const [birthTime, setBirthTime] = useState(new Date(1990, 0, 1, 10, 30));
  const [placeLabel, setPlaceLabel] = useState(COMMON_PLACES[0].label);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError('');
    const place = COMMON_PLACES.find((p) => p.label === placeLabel);
    setLoading(true);
    try {
      const payload = {
        name, username, password, gender,
        email: email || undefined,
        mobile: mobile || undefined,
        preferred_language: 'ta',
        birth: {
          date: formatDate(birthDate),
          time: formatTime(birthTime),
          place: place.label,
          latitude: place.lat,
          longitude: place.lon,
          timezone_offset: place.tz,
        },
      };
      const { data } = await signup(payload);
      await signIn(data.access_token, data.user_id);
    } catch (err) {
      setError(extractErrorMessage(err, 'பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>பதிவு செய்யவும்</Text>

          <ParchmentCard>
            <FormField label="பெயர் (Name)" value={name} onChangeText={setName} />
            <FormField label="பயனர் பெயர்" value={username} onChangeText={setUsername} autoCapitalize="none" />
            <FormField label="கடவுச்சொல்" value={password} onChangeText={setPassword} secureTextEntry />

            <Text style={styles.label}>பாலினம் (Gender)</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity style={styles.radioRow} onPress={() => setGender('male')}>
                <View style={[styles.radioOuter, gender === 'male' && styles.radioOuterActive]}>
                  {gender === 'male' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>ஆண்</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioRow} onPress={() => setGender('female')}>
                <View style={[styles.radioOuter, gender === 'female' && styles.radioOuterActive]}>
                  {gender === 'female' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>பெண்</Text>
              </TouchableOpacity>
            </View>

            <FormField label="மின்னஞ்சல்" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <FormField label="மொபைல்" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />

            <RopeDivider knots={1} />
            <Text style={[styles.label, { marginBottom: 8 }]}>பிறப்பு விவரங்கள் (Birth Details)</Text>

            <Text style={styles.label}>பிறந்த தேதி</Text>
            <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.pickerButtonText}>{formatDate(birthDate)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                onChange={(event, selected) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selected) setBirthDate(selected);
                }}
              />
            )}

            <Text style={[styles.label, { marginTop: 10 }]}>பிறந்த நேரம்</Text>
            <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.pickerButtonText}>{formatTime(birthTime)}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={birthTime}
                mode="time"
                is24Hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selected) => {
                  setShowTimePicker(Platform.OS === 'ios');
                  if (selected) setBirthTime(selected);
                }}
              />
            )}

            <Text style={[styles.label, { marginTop: 10 }]}>பிறந்த இடம்</Text>
            <View style={styles.pickerWrap}>
              <Picker selectedValue={placeLabel} onValueChange={setPlaceLabel}>
                {COMMON_PLACES.map((p) => (
                  <Picker.Item key={p.label} label={p.label} value={p.label} />
                ))}
              </Picker>
            </View>
            <Text style={styles.hint}>உங்கள் ஊர் இல்லையெனில் நெருக்கமான பெரிய நகரத்தைத் தேர்ந்தெடுக்கவும்.</Text>

            {!!error && <Text style={styles.error}>{error}</Text>}

            <GoldButton
              title={loading ? 'உருவாக்கப்படுகிறது...' : 'கணக்கு உருவாக்கவும்'}
              onPress={handleSignup}
              loading={loading}
              style={{ marginTop: 14 }}
            />
          </ParchmentCard>

          <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
            ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontFamily: fonts.heading, color: colors.gold, fontSize: 22, textAlign: 'center', marginBottom: 16 },
  label: { fontFamily: fonts.bodySemibold, color: colors.inkBrown, fontSize: 13, marginBottom: 6 },
  genderRow: { flexDirection: 'row', gap: 20, marginBottom: 12 },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  radioOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: colors.inkBrown, alignItems: 'center', justifyContent: 'center' },
  radioOuterActive: { borderColor: colors.gold },
  radioInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.gold },
  radioLabel: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 14 },
  pickerButton: {
    backgroundColor: 'rgba(255,255,255,0.55)', borderWidth: 1, borderColor: 'rgba(107,78,46,0.5)',
    borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 4,
  },
  pickerButtonText: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 15 },
  pickerWrap: { backgroundColor: 'rgba(255,255,255,0.55)', borderWidth: 1, borderColor: 'rgba(107,78,46,0.5)', borderRadius: 8, marginBottom: 4, overflow: 'hidden' },
  hint: { fontFamily: fonts.manuscript, color: colors.inkBrown, fontSize: 12, opacity: 0.7, marginBottom: 8 },
  error: { fontFamily: fonts.body, color: colors.alertRed, fontSize: 13, marginVertical: 6 },
  footerLink: { fontFamily: fonts.bodySemibold, color: colors.gold, fontSize: 13, textAlign: 'center', marginTop: 18, textDecorationLine: 'underline' },
});
