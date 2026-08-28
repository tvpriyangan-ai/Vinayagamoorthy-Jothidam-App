import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import FeatureScreenShell from '../components/FeatureScreenShell';
import ParchmentCard from '../components/ParchmentCard';
import { getTodayPanchangam } from '../api/client';
import { colors, fonts, radii } from '../theme/theme';

export default function PanchangamScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getTodayPanchangam().then((res) => setData(res.data)).catch(() => setError('பஞ்சாங்கத்தை ஏற்ற முடியவில்லை.'));
  }, []);

  if (error) return <FeatureScreenShell title="Panchangam" navigation={navigation}><ParchmentCard><Text style={styles.errorText}>{error}</Text></ParchmentCard></FeatureScreenShell>;
  if (!data) return <FeatureScreenShell title="Panchangam" navigation={navigation}><ActivityIndicator color={colors.gold} /></FeatureScreenShell>;

  return (
    <FeatureScreenShell title="Panchangam" subtitle={`${data.date} · ${data.vaaram}`} navigation={navigation}>
      <ParchmentCard style={{ marginBottom: 14 }}>
        <Text style={styles.cardTitle}>பஞ்சாங்க விவரங்கள்</Text>
        <InfoRow label="வாரம்" value={data.vaaram} />
        <InfoRow label="சூரிய உதயம்" value={data.sunrise} />
        <InfoRow label="சூரிய அஸ்தமனம்" value={data.sunset} />
        <InfoRow label="திதி" value={`${data.tithi.name_ta} (${data.tithi.number})`} />
        <InfoRow label="பக்ஷம்" value={data.tithi.paksha} />
        <InfoRow label="நட்சத்திரம்" value={`${data.nakshatra.name_ta}, பாதம் ${data.nakshatra.pada}`} />
        <InfoRow label="யோகம்" value={data.yoga.name_ta} />
        <InfoRow label="கரணம்" value={data.karana.name_ta} />
      </ParchmentCard>

      <ParchmentCard>
        <Text style={styles.cardTitle}>அசுப காலங்கள்</Text>
        <Text style={styles.hint}>இந்த நேரங்களில் புதிய முக்கிய காரியங்களைத் தொடங்குவதைத் தவிர்க்கவும்</Text>
        <TimeBlock label="ராகு காலம்" start={data.rahu_kalam.start} end={data.rahu_kalam.end} />
        <TimeBlock label="எமகண்டம்" start={data.yamagandam.start} end={data.yamagandam.end} />
        <TimeBlock label="குளிகை காலம்" start={data.gulikai_kalam.start} end={data.gulikai_kalam.end} />
      </ParchmentCard>
    </FeatureScreenShell>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function TimeBlock({ label, start, end }) {
  return (
    <View style={styles.timeBlock}>
      <Text style={styles.timeLabel}>{label}</Text>
      <Text style={styles.timeValue}>{start} - {end}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: { fontFamily: fonts.body, color: colors.alertRed, textAlign: 'center' },
  cardTitle: { fontFamily: fonts.headingMedium, color: colors.parchmentHeading, fontSize: 15, textAlign: 'center', marginBottom: 10 },
  hint: { fontFamily: fonts.manuscript, color: colors.inkBrown, fontSize: 12, textAlign: 'center', opacity: 0.75, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: 'rgba(107,78,46,0.15)' },
  rowLabel: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 13, opacity: 0.75 },
  rowValue: { fontFamily: fonts.bodySemibold, color: colors.inkBrown, fontSize: 13 },
  timeBlock: { backgroundColor: 'rgba(122,35,24,0.12)', borderWidth: 1, borderColor: 'rgba(122,35,24,0.3)', borderRadius: radii.sm, padding: 10, marginBottom: 8, alignItems: 'center' },
  timeLabel: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 12, opacity: 0.75 },
  timeValue: { fontFamily: fonts.bodyBold, color: colors.inkBrown, fontSize: 14, marginTop: 2 },
});
