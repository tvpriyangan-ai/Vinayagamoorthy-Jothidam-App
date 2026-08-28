import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import FeatureScreenShell from '../components/FeatureScreenShell';
import ParchmentCard from '../components/ParchmentCard';
import { getMyJathagam } from '../api/client';
import { colors, fonts } from '../theme/theme';

const PLANET_SHORT_TA = { Sun: 'சூ', Moon: 'சந்', Mars: 'செ', Mercury: 'பு', Jupiter: 'கு', Venus: 'சு', Saturn: 'ச', Rahu: 'ரா', Ketu: 'கே' };

export default function JathagamScreen({ navigation }) {
  const [chart, setChart] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyJathagam().then((res) => setChart(res.data)).catch(() => setError('ஜாதகத்தை ஏற்ற முடியவில்லை.'));
  }, []);

  if (error) {
    return <FeatureScreenShell title="Full Jathagam" navigation={navigation}><ParchmentCard><Text style={styles.errorText}>{error}</Text></ParchmentCard></FeatureScreenShell>;
  }
  if (!chart) {
    return <FeatureScreenShell title="Full Jathagam" navigation={navigation}><ActivityIndicator color={colors.gold} /></FeatureScreenShell>;
  }

  const lagnaRasiIndex = chart.ascendant.rasi_index;
  const planetsByRasi = {};
  Object.entries(chart.planets).forEach(([name, info]) => {
    if (!planetsByRasi[info.rasi_index]) planetsByRasi[info.rasi_index] = [];
    planetsByRasi[info.rasi_index].push(name);
  });

  function Cell({ rasiIndex }) {
    const isLagna = rasiIndex === lagnaRasiIndex;
    const planets = planetsByRasi[rasiIndex] || [];
    return (
      <View style={[styles.cell, isLagna && styles.cellLagna]}>
        {isLagna && <Text style={styles.lagnaTag}>ல</Text>}
        <Text style={styles.cellPlanets}>{planets.map((p) => PLANET_SHORT_TA[p]).join(' ')}</Text>
      </View>
    );
  }

  return (
    <FeatureScreenShell title="Full Jathagam" subtitle={`${chart.rasi} ராசி · ${chart.nakshatra} நட்சத்திரம்`} navigation={navigation}>
      <ParchmentCard style={{ marginBottom: 14 }}>
        <Text style={styles.cardTitle}>ராசி சக்கரம்</Text>
        <View style={styles.chartWrap}>
          <View style={styles.row}>
            <Cell rasiIndex={11} /><Cell rasiIndex={0} /><Cell rasiIndex={1} /><Cell rasiIndex={2} />
          </View>
          <View style={[styles.row, { flex: 2 }]}>
            <View style={{ flex: 1 }}>
              <Cell rasiIndex={10} />
              <Cell rasiIndex={9} />
            </View>
            <View style={styles.centerCell}>
              <Text style={styles.centerLabel}>லக்னம்</Text>
              <Text style={styles.centerValue}>{chart.ascendant.rasi_name_ta}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Cell rasiIndex={3} />
              <Cell rasiIndex={4} />
            </View>
          </View>
          <View style={styles.row}>
            <Cell rasiIndex={8} /><Cell rasiIndex={7} /><Cell rasiIndex={6} /><Cell rasiIndex={5} />
          </View>
        </View>
        <Text style={styles.hint}>ல = லக்னம் | தென்னிந்திய பாணி ராசி சக்கரம்</Text>
      </ParchmentCard>

      <ParchmentCard>
        <Text style={styles.cardTitle}>கிரக நிலைகள்</Text>
        {Object.entries(chart.planets).map(([name, info]) => (
          <View key={name} style={styles.planetRow}>
            <Text style={styles.planetName}>{PLANET_SHORT_TA[name]} {name}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.planetDetail}>{info.rasi_name_ta} ({info.degree_in_rasi}°)</Text>
              <Text style={styles.planetDetail}>{info.nakshatra_name_ta}{info.retrograde ? ' · வக்ரம்' : ''}</Text>
            </View>
          </View>
        ))}
      </ParchmentCard>
    </FeatureScreenShell>
  );
}

const styles = StyleSheet.create({
  errorText: { fontFamily: fonts.body, color: colors.alertRed, textAlign: 'center' },
  cardTitle: { fontFamily: fonts.headingMedium, color: colors.parchmentHeading, fontSize: 15, textAlign: 'center', marginBottom: 10 },
  chartWrap: { aspectRatio: 1, borderWidth: 1, borderColor: 'rgba(107,78,46,0.4)' },
  row: { flexDirection: 'row', flex: 1 },
  cell: { flex: 1, borderWidth: 0.5, borderColor: 'rgba(107,78,46,0.4)', alignItems: 'center', justifyContent: 'center', padding: 2 },
  cellLagna: { backgroundColor: 'rgba(216,180,92,0.35)' },
  lagnaTag: { fontFamily: fonts.bodyBold, color: colors.alertRed, fontSize: 10 },
  cellPlanets: { fontFamily: fonts.bodySemibold, color: colors.inkBrown, fontSize: 11, textAlign: 'center' },
  centerCell: { flex: 2, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: 'rgba(107,78,46,0.4)' },
  centerLabel: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 10, opacity: 0.7 },
  centerValue: { fontFamily: fonts.bodyBold, color: colors.inkBrown, fontSize: 13 },
  hint: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 10, textAlign: 'center', opacity: 0.7, marginTop: 8 },
  planetRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: 'rgba(107,78,46,0.2)' },
  planetName: { fontFamily: fonts.bodySemibold, color: colors.inkBrown, fontSize: 13, width: 90 },
  planetDetail: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 12, textAlign: 'right' },
});
