import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import FeatureScreenShell from '../components/FeatureScreenShell';
import ParchmentCard from '../components/ParchmentCard';
import GoldButton from '../components/GoldButton';
import { getMyDosha, getTemplesForMyDoshas } from '../api/client';
import { colors, fonts, radii } from '../theme/theme';

export default function DoshaScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [temples, setTemples] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getMyDosha(), getTemplesForMyDoshas()])
      .then(([d, t]) => { setData(d.data); setTemples(t.data); })
      .catch(() => setError('தோஷ அறிக்கையை ஏற்ற முடியவில்லை.'));
  }, []);

  if (error) return <FeatureScreenShell title="தோஷ பரிகாரங்கள்" navigation={navigation}><ParchmentCard><Text style={styles.errorText}>{error}</Text></ParchmentCard></FeatureScreenShell>;
  if (!data) return <FeatureScreenShell title="தோஷ பரிகாரங்கள்" navigation={navigation}><ActivityIndicator color={colors.gold} /></FeatureScreenShell>;

  return (
    <FeatureScreenShell title="தோஷ பரிகாரங்கள்" navigation={navigation}>
      {data.doshas.map((dosha) => (
        <ParchmentCard key={dosha.name} style={{ marginBottom: 12 }}>
          <View style={styles.doshaHeader}>
            <Text style={styles.doshaName}>{dosha.name}</Text>
            <View style={[styles.badge, { backgroundColor: dosha.present ? 'rgba(122,35,24,0.15)' : 'rgba(60,120,60,0.15)' }]}>
              <Text style={[styles.badgeText, { color: dosha.present ? colors.alertRed : colors.successGreen }]}>
                {dosha.present ? 'உள்ளது' : 'இல்லை'}
              </Text>
            </View>
          </View>
          <Text style={styles.detail}>{dosha.detail}</Text>
          {!!dosha.phase && <Text style={styles.phase}>கட்டம்: {dosha.phase}</Text>}
          {dosha.present && dosha.remedies?.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={styles.remedyTitle}>பரிகாரங்கள்:</Text>
              {dosha.remedies.map((r, i) => <Text key={i} style={styles.remedyItem}>• {r}</Text>)}
            </View>
          )}
        </ParchmentCard>
      ))}

      <ParchmentCard style={{ marginBottom: 12 }}>
        <Text style={styles.note}>{data.note}</Text>
      </ParchmentCard>

      {temples?.recommended_temples?.length > 0 && (
        <ParchmentCard>
          <Text style={styles.cardTitle}>பரிந்துரைக்கப்பட்ட கோவில்கள்</Text>
          {temples.recommended_temples.map((t) => (
            <View key={t.id} style={styles.templeItem}>
              <Text style={styles.templeName}>{t.name_ta}</Text>
              <Text style={styles.templePlace}>{t.place}, {t.state}</Text>
            </View>
          ))}
          <GoldButton title="அனைத்து கோவில்களையும் காண்க" onPress={() => navigation.navigate('Temples')} style={{ marginTop: 10 }} />
        </ParchmentCard>
      )}
    </FeatureScreenShell>
  );
}

const styles = StyleSheet.create({
  errorText: { fontFamily: fonts.body, color: colors.alertRed, textAlign: 'center' },
  cardTitle: { fontFamily: fonts.headingMedium, color: colors.parchmentHeading, fontSize: 15, textAlign: 'center', marginBottom: 10 },
  doshaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  doshaName: { fontFamily: fonts.headingMedium, color: colors.parchmentHeading, fontSize: 14, flexShrink: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill },
  badgeText: { fontFamily: fonts.bodyBold, fontSize: 11 },
  detail: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 13, opacity: 0.85, marginBottom: 4 },
  phase: { fontFamily: fonts.bodySemibold, color: colors.inkBrown, fontSize: 13, marginBottom: 4 },
  remedyTitle: { fontFamily: fonts.bodySemibold, color: colors.inkBrown, fontSize: 13, marginBottom: 4 },
  remedyItem: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 12, opacity: 0.9, marginBottom: 2 },
  note: { fontFamily: fonts.manuscript, color: colors.inkBrown, fontSize: 13, textAlign: 'center', opacity: 0.8 },
  templeItem: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: radii.sm, padding: 10, marginBottom: 8 },
  templeName: { fontFamily: fonts.bodySemibold, color: colors.inkBrown, fontSize: 13 },
  templePlace: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 11, opacity: 0.7 },
});
