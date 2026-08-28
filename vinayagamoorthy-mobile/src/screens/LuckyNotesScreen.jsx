import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import FeatureScreenShell from '../components/FeatureScreenShell';
import ParchmentCard from '../components/ParchmentCard';
import { getMyLuckyNotes } from '../api/client';
import { colors, fonts } from '../theme/theme';

export default function LuckyNotesScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyLuckyNotes().then((res) => setData(res.data)).catch(() => setError('அதிர்ஷ்ட குறிப்புகளை ஏற்ற முடியவில்லை.'));
  }, []);

  if (error) return <FeatureScreenShell title="Lucky Notes" navigation={navigation}><ParchmentCard><Text style={styles.errorText}>{error}</Text></ParchmentCard></FeatureScreenShell>;
  if (!data) return <FeatureScreenShell title="Lucky Notes" navigation={navigation}><ActivityIndicator color={colors.gold} /></FeatureScreenShell>;

  return (
    <FeatureScreenShell title="Lucky Notes" subtitle={`${data.rasi} ராசிக்கான குறிப்புகள்`} navigation={navigation}>
      <ParchmentCard style={{ marginBottom: 14 }}>
        <Text style={styles.cardTitle}>அனுகூலமான குறிப்புகள்</Text>
        <NoteRow label="ஆளும் கிரகம்" value={data.favorable.ruling_planet} />
        <NoteRow label="அதிர்ஷ்ட நிறம்" value={data.favorable.lucky_color} />
        <NoteRow label="அதிர்ஷ்ட எண்" value={data.favorable.lucky_number} />
        <NoteRow label="அதிர்ஷ்ட நாள்" value={data.favorable.lucky_day} />
        <NoteRow label="அதிர்ஷ்ட கல்" value={data.favorable.lucky_stone} />
        <NoteRow label="அதிர்ஷ்ட உலோகம்" value={data.favorable.lucky_metal} />
        <NoteRow label="நட்பு ராசிகள்" value={data.favorable.friendly_rasis.join(', ')} />
      </ParchmentCard>

      <ParchmentCard>
        <Text style={[styles.cardTitle, { color: colors.alertRed }]}>கவனிக்க வேண்டியவை</Text>
        <NoteRow label="சவாலான ராசிகள்" value={data.unfavorable.challenging_rasis.join(', ') || 'இல்லை'} />
        <NoteRow label="சவாலான கிரகங்கள்" value={data.unfavorable.challenging_planets.join(', ') || 'இல்லை'} />
        <Text style={styles.hint}>இவை பொது வழிகாட்டுதல்கள் — உங்கள் முழு ஜாதகத்தை பொறுத்து மாறுபடலாம்.</Text>
      </ParchmentCard>
    </FeatureScreenShell>
  );
}

function NoteRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: { fontFamily: fonts.body, color: colors.alertRed, textAlign: 'center' },
  cardTitle: { fontFamily: fonts.headingMedium, color: colors.parchmentHeading, fontSize: 15, textAlign: 'center', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: 'rgba(107,78,46,0.15)' },
  rowLabel: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 13, opacity: 0.75 },
  rowValue: { fontFamily: fonts.bodySemibold, color: colors.inkBrown, fontSize: 13, flexShrink: 1, textAlign: 'right', marginLeft: 8 },
  hint: { fontFamily: fonts.manuscript, color: colors.inkBrown, fontSize: 12, textAlign: 'center', opacity: 0.7, marginTop: 10 },
});
