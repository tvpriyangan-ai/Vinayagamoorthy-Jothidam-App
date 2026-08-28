import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import FeatureScreenShell from '../components/FeatureScreenShell';
import ParchmentCard from '../components/ParchmentCard';
import { listTemples } from '../api/client';
import { colors, fonts, radii } from '../theme/theme';

export default function TemplesScreen({ navigation }) {
  const [temples, setTemples] = useState(null);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    listTemples().then((res) => setTemples(res.data)).catch(() => setError('கோவில் தகவல்களை ஏற்ற முடியவில்லை.'));
  }, []);

  return (
    <FeatureScreenShell title="Temples & Pujas" subtitle="நவகிரக தலங்கள் மற்றும் முக்கிய கோவில்கள்" navigation={navigation}>
      {!!error && <ParchmentCard><Text style={styles.errorText}>{error}</Text></ParchmentCard>}
      {!temples && !error && <ActivityIndicator color={colors.gold} />}
      {temples?.map((t) => (
        <TouchableOpacity key={t.id} onPress={() => setExpanded(expanded === t.id ? null : t.id)}>
          <ParchmentCard style={{ marginBottom: 12 }}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{t.name_ta}</Text>
                <Text style={styles.nameEn}>{t.name_en}</Text>
              </View>
              {!!t.associated_planet && (
                <View style={styles.planetBadge}><Text style={styles.planetBadgeText}>{t.associated_planet}</Text></View>
              )}
            </View>
            <Text style={styles.deity}>{t.deity}</Text>
            <Text style={styles.place}>{t.place}, {t.state}</Text>

            {expanded === t.id && (
              <View style={styles.expanded}>
                <Text style={styles.description}>{t.description}</Text>
                {t.pujas?.length > 0 && (
                  <>
                    <Text style={styles.pujaTitle}>பூஜைகள்:</Text>
                    {t.pujas.map((p, i) => (
                      <Text key={i} style={styles.pujaItem}>
                        • {p.name}{p.recommended_day ? ` (${p.recommended_day})` : ''} — {p.description}
                      </Text>
                    ))}
                  </>
                )}
              </View>
            )}
            <Text style={styles.expandHint}>{expanded === t.id ? '▲ மறை' : '▼ மேலும் காண'}</Text>
          </ParchmentCard>
        </TouchableOpacity>
      ))}
    </FeatureScreenShell>
  );
}

const styles = StyleSheet.create({
  errorText: { fontFamily: fonts.body, color: colors.alertRed, textAlign: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { fontFamily: fonts.bodySemibold, color: colors.inkBrown, fontSize: 14 },
  nameEn: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 11, opacity: 0.7 },
  planetBadge: { backgroundColor: 'rgba(216,180,92,0.35)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radii.pill },
  planetBadgeText: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 10 },
  deity: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 13, marginTop: 4 },
  place: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 11, opacity: 0.7 },
  expanded: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(107,78,46,0.3)' },
  description: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 12, marginBottom: 6 },
  pujaTitle: { fontFamily: fonts.bodySemibold, color: colors.inkBrown, fontSize: 12, marginBottom: 2 },
  pujaItem: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 11, opacity: 0.9 },
  expandHint: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 11, textAlign: 'center', opacity: 0.6, marginTop: 6 },
});
