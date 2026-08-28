import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii } from '../theme/theme';

export default function ParchmentCard({ children, style, decorated = true }) {
  return (
    <LinearGradient
      colors={[colors.parchmentLight, colors.parchmentMid, colors.parchmentDark]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={[styles.card, style]}
    >
      {decorated && (
        <>
          <Text style={styles.cornerTL}>❖</Text>
          <Text style={styles.cornerTR}>❖</Text>
        </>
      )}
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(216,180,92,0.55)',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  cornerTL: { position: 'absolute', top: 6, left: 8, color: colors.gold, fontSize: 12, opacity: 0.8 },
  cornerTR: { position: 'absolute', top: 6, right: 8, color: colors.gold, fontSize: 12, opacity: 0.8 },
});
