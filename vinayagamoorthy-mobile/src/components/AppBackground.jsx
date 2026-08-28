import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/theme';

export default function AppBackground({ children }) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[colors.emberBrown, colors.inkBlack]}
      style={[styles.fill, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
