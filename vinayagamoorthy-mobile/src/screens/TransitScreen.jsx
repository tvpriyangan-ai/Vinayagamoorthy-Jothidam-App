import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import FeatureScreenShell from '../components/FeatureScreenShell';
import ParchmentCard from '../components/ParchmentCard';
import { getMyTransitPredictions } from '../api/client';
import { colors, fonts, radii } from '../theme/theme';

export default function TransitScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyTransitPredictions().then((res) => setData(res.data)).catch(() => setError('கிரக நிலைகளை ஏற்ற முடியவில்லை.'));
  }, []);

  if (error) return <FeatureScreenShell title="Transit Predictions" navigation={navigation}><ParchmentCard><Text style={styles.errorText}>{error}</Text></ParchmentCard></FeatureScreenShell>;
  if (!data) return <FeatureScreenShell title="Transit Predictions" navigation={navigation}><ActivityIndicator color={colors.gold} /></FeatureScreenShell>;

  return (
    <FeatureScreenShell title="Transit Predictions" subtitle={`${data.date} · உங்கள் ராசி: ${data.natal_moon_rasi}`} navigation={navigation}>
      {data.transits.map((t) => (
        <ParchmentCard key={t.planet} style={{ marginBottom: 10 }}>
          <View style={styles.row}>
            <Text style={styles.planetName}>{t.planet_name_ta} ({t.planet})</Text>
            <View style={[styles.badge, { backgroundColor: t.favorable ? 'rgba(60,120,60,0.15)' : 'rgba(122,35,24,0.12)' }]}>
              <Text style={[styles.badgeText, { color: t.favorable ? colors.successGreen : colors.alertRed }]}>
                {t.favorable ? 'சாதகம்' : 'கவனம் தேவை'}
              </Text>
            </View>
          </View>
          <Text style={styles.detail}>தற்போதைய ராசி: {t.current_rasi}</Text>
          <Text style={styles.detail}>உங்கள் ராசியிலிருந்து {t.house_from_moon}ம் வீடு</Text>
          {t.retrograde && <Text style={styles.retro}>(வக்ர கதியில் உள்ளது)</Text>}
        </ParchmentCard>
      ))}

      <ParchmentCard>
        <Text style={styles.note}>{data.note}</Text>
      </ParchmentCard>
    </FeatureScreenShell>
  );
}

const styles = StyleSheet.create({
  errorText: { fontFamily: fonts.body, color: colors.alertRed, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  planetName: { fontFamily: fonts.bodySemibold, color: colors.inkBrown, fontSize: 14, flexShrink: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.pill },
  badgeText: { fontFamily: fonts.bodyBold, fontSize: 10 },
  detail: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 12, opacity: 0.85 },
  retro: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 11, opacity: 0.6, marginTop: 2 },
  note: { fontFamily: fonts.manuscript, color: colors.inkBrown, fontSize: 13, textAlign: 'center', opacity: 0.8 },
});
