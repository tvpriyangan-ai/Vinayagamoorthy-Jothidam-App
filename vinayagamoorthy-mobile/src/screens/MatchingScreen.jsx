import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import FeatureScreenShell from '../components/FeatureScreenShell';
import ParchmentCard from '../components/ParchmentCard';
import FormField from '../components/FormField';
import GoldButton from '../components/GoldButton';
import RopeDivider from '../components/RopeDivider';
import { checkMatching, extractErrorMessage } from '../api/client';
import { COMMON_PLACES } from '../data/places';
import { colors, fonts } from '../theme/theme';

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function formatTime(d) {
  return d.toTimeString().slice(0, 5);
}

export default function MatchingScreen({ navigation }) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('female');
  const [birthDate, setBirthDate] = useState(new Date(1990, 0, 1));
  const [birthTime, setBirthTime] = useState(new Date(1990, 0, 1, 10, 30));
  const [placeLabel, setPlaceLabel] = useState(COMMON_PLACES[0].label);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    setResult(null);
    const place = COMMON_PLACES.find((p) => p.label === placeLabel);
    setLoading(true);
    try {
      const { data } = await checkMatching({
        name, gender,
        birth: {
          date: formatDate(birthDate), time: formatTime(birthTime), place: place.label,
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
    <FeatureScreenShell title="Matching & Advices" subtitle="பத்து பொருத்தம் பகுப்பாய்வு" navigation={navigation}>
      <ParchmentCard style={{ marginBottom: 14 }}>
        <Text style={styles.cardTitle}>துணையின் விவரங்கள்</Text>
        <FormField label="பெயர்" value={name} onChangeText={setName} />

        <Text style={styles.label}>பாலினம்</Text>
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

        <Text style={styles.label}>பிறந்த தேதி</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.pickerButtonText}>{formatDate(birthDate)}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={birthDate} mode="date" maximumDate={new Date()}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, selected) => { setShowDatePicker(Platform.OS === 'ios'); if (selected) setBirthDate(selected); }}
          />
        )}

        <Text style={[styles.label, { marginTop: 8 }]}>பிறந்த நேரம்</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
          <Text style={styles.pickerButtonText}>{formatTime(birthTime)}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={birthTime} mode="time" is24Hour
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, selected) => { setShowTimePicker(Platform.OS === 'ios'); if (selected) setBirthTime(selected); }}
          />
        )}

        <Text style={[styles.label, { marginTop: 8 }]}>பிறந்த இடம்</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={placeLabel} onValueChange={setPlaceLabel}>
            {COMMON_PLACES.map((p) => <Picker.Item key={p.label} label={p.label} value={p.label} />)}
          </Picker>
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}
        <GoldButton title={loading ? 'கணக்கிடுகிறது...' : 'பொருத்தம் பார்க்கவும்'} onPress={handleSubmit} loading={loading} style={{ marginTop: 10 }} />
      </ParchmentCard>

      {result && (
        <>
          <RopeDivider knots={2} />
          <ParchmentCard style={{ marginTop: 10 }}>
            <View style={styles.pairRow}>
              <View style={styles.pairSide}>
                <Text style={styles.pairLabel}>பெண்</Text>
                <Text style={styles.pairValue}>{result.girl.rasi}</Text>
                <Text style={styles.pairSub}>{result.girl.nakshatra}</Text>
              </View>
              <Text style={{ fontSize: 22 }}>💞</Text>
              <View style={styles.pairSide}>
                <Text style={styles.pairLabel}>ஆண்</Text>
                <Text style={styles.pairValue}>{result.boy.rasi}</Text>
                <Text style={styles.pairSub}>{result.boy.nakshatra}</Text>
              </View>
            </View>

            <Text style={styles.score}>{result.matched_count} / {result.total_count}</Text>
            <Text style={styles.scoreSub}>பொருத்தங்கள் பொருந்தியது</Text>

            {result.critical_failures.length > 0 && (
              <Text style={styles.criticalWarning}>கவனம்: {result.critical_failures.join(', ')} பொருந்தவில்லை</Text>
            )}

            {result.poruthams.map((p) => (
              <View key={p.name} style={styles.poruthamRow}>
                <Text style={styles.poruthamName}>{p.name}</Text>
                <View style={styles.poruthamRight}>
                  <Text style={styles.poruthamDetail}>{p.detail}</Text>
                  <Text style={{ color: p.matched ? colors.successGreen : colors.alertRed, fontWeight: 'bold' }}>
                    {p.matched ? '✓' : '✗'}
                  </Text>
                </View>
              </View>
            ))}

            <Text style={styles.finalNote}>{result.note}</Text>
          </ParchmentCard>
        </>
      )}
    </FeatureScreenShell>
  );
}

const styles = StyleSheet.create({
  cardTitle: { fontFamily: fonts.headingMedium, color: colors.parchmentHeading, fontSize: 15, textAlign: 'center', marginBottom: 10 },
  label: { fontFamily: fonts.bodySemibold, color: colors.inkBrown, fontSize: 13, marginBottom: 6 },
  genderRow: { flexDirection: 'row', gap: 20, marginBottom: 10 },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  radioOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: colors.inkBrown, alignItems: 'center', justifyContent: 'center' },
  radioOuterActive: { borderColor: colors.gold },
  radioInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.gold },
  radioLabel: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 14 },
  pickerButton: { backgroundColor: 'rgba(255,255,255,0.55)', borderWidth: 1, borderColor: 'rgba(107,78,46,0.5)', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 4 },
  pickerButtonText: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 15 },
  pickerWrap: { backgroundColor: 'rgba(255,255,255,0.55)', borderWidth: 1, borderColor: 'rgba(107,78,46,0.5)', borderRadius: 8, overflow: 'hidden', marginBottom: 4 },
  error: { fontFamily: fonts.body, color: colors.alertRed, fontSize: 13, marginTop: 6 },
  pairRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 10 },
  pairSide: { alignItems: 'center' },
  pairLabel: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 11, opacity: 0.7 },
  pairValue: { fontFamily: fonts.bodyBold, color: colors.inkBrown, fontSize: 14 },
  pairSub: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 11 },
  score: { fontFamily: fonts.heading, color: colors.inkBrown, fontSize: 30, textAlign: 'center' },
  scoreSub: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 12, textAlign: 'center', opacity: 0.7, marginBottom: 10 },
  criticalWarning: { fontFamily: fonts.bodySemibold, color: colors.alertRed, fontSize: 13, textAlign: 'center', marginBottom: 8 },
  poruthamRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: 'rgba(107,78,46,0.15)' },
  poruthamName: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 12, flexShrink: 1, flex: 1 },
  poruthamRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  poruthamDetail: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 10, opacity: 0.7 },
  finalNote: { fontFamily: fonts.manuscript, color: colors.inkBrown, fontSize: 12, textAlign: 'center', opacity: 0.75, marginTop: 10 },
});
