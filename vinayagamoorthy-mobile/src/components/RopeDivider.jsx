import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/theme';

export default function RopeDivider({ knots = 2 }) {
  return (
    <View style={styles.row}>
      <View style={styles.rope} />
      {Array.from({ length: knots }).map((_, i) => (
        <View key={i} style={styles.knot} />
      ))}
      <View style={styles.rope} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 12 },
  rope: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.gold,
    opacity: 0.85,
  },
  knot: {
    width: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: colors.goldBright,
    borderWidth: 1,
    borderColor: '#8a6a34',
  },
});
